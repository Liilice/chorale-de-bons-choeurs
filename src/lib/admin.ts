import { db } from "./firebase-admin";
import * as bcrypt from "bcrypt";

type Admin = {
  password: string;
};

export async function createAdmin(data: Admin): Promise<Admin> {
  const hashedPassword = await bcrypt.hash(data.password, 10);
  const docRef = await db.collection("admins").add({
    password: hashedPassword,
  });

  const doc = await docRef.get();
  const admin = doc.data() as Admin;
  return admin;
}

export async function getOne(): Promise<string | null> {
  const snapshot = await db.collection("admins").limit(1).get();
  if (snapshot.empty) {
    return null;
  }
  const doc = snapshot.docs[0];
  const data = doc.data();
  return data.password;
}
