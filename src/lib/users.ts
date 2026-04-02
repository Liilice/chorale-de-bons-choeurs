import { db } from "./firebase-admin";
import SumUp from "@sumup/sdk";

const client = new SumUp({
  apiKey: process.env.SUMUP_API_KEY,
});

type UserInput = {
  name: string;
  email: string;
};

type User = UserInput & {
  customerId: string;
  createdAt: Date;
};

export async function createUser(data: UserInput): Promise<User> {
  const customerID = await client.customers.create({
    customer_id: crypto.randomUUID(),
    personal_details: {
      first_name: data.name,
      email: data.email,
    },
  });

  const docRef = await db.collection("users").add({
    name: data.name,
    email: data.email,
    customerId: customerID.customer_id,
    createdAt: new Date(),
  });

  const doc = await docRef.get();
  const customer = doc.data() as User;
  return customer;
}

export async function findUserByEmail(email: string): Promise<User | null> {
  const snapshot = await db
    .collection("users")
    .where("email", "==", email)
    .limit(1)
    .get();

  if (snapshot.empty) {
    return null;
  }

  const doc = snapshot.docs[0];
  const data = doc.data();
  return {
    name: data.name,
    email: data.email,
    customerId: data.customerId,
    createdAt: data.createdAt?.toDate?.() ?? data.createdAt,
  };
}

export async function findOrCreateUser(data: UserInput): Promise<User> {
  const existingUser = await findUserByEmail(data.email);

  if (existingUser) {
    return existingUser;
  }
  return await createUser(data);
}

export async function findAll(): Promise<User[]> {
  const snapshot = await db.collection("users").get();
  const users = snapshot.docs.map((doc) => {
    const docData = doc.data();
    return {
      name: docData.name,
      email: docData.email,
      customerId: docData.customerId,
      createdAt: docData.createdAt?.toDate?.() ?? docData.createdAt,
    };
  });
  return users;
}
