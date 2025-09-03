import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { harperInsert, harperSQL } from "@/lib/harper";

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Missing username or password" },
        { status: 400 }
      );
    }

    let existing: any[] = [];
    try {
      existing = await harperSQL(
        `SELECT * FROM \`pokedex\`.\`users\` WHERE username = '${username.replace(
          /'/g,
          "''"
        )}'`
      );
    } catch (e: any) {
      // ignore "unknown column" errors → means table has no users yet
      if (!String(e).includes("unknown column")) {
        throw e;
      }
    }

    if (existing.length > 0) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = {
      id: crypto.randomUUID(),
      username,
      passwordHash,
    };

    await harperInsert("pokedex", "users", [user]);

    return NextResponse.json({
      success: true,
      user: { id: user.id, username: user.username },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || String(err) },
      { status: 500 }
    );
  }
}
