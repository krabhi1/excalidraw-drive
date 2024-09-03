import client from "@/lib/mongodb";

export type User = {
  name: string;
  email: string;
  refreshToken: string;
  picUrl: string;
};
export async function findUserByEmail(email: string) {}
async function createUser(email: string, refreshToken: string) {}
async function updateUser(email: string, refreshToken: string) {}

//temp
export async function getAllUsers() {
  const users = await client.db("excalidraw-drive-dev").collection("users").find().toArray();
  return users;
}
