import { db } from "../../../common/knex/knex";
import { User } from "../entity/user.entity";

const USER_COLUMNS = [
    "id",
    "email",    
    "phone",
    "password_hash as passwordHash",
    "system_role as systemRole",
    "deleted_at as deletedAt",
    "created_at as createdAt",
    "updated_at as updatedAt"
]

function toEntity(row: any): User {
    return new User({
        id: row.id,
        email: row.email,
        phone: row.phone,
        passwordHash: row.password_hash,     
        systemRole: row.system_role,
        deletedAt: row.deleted_at,
        createdAt: row.created_at,
        updatedAt: row.updated_at
    })
}

export async function findUserByEmail(email: string): Promise<User | undefined> {
    const row = await db("users").select(USER_COLUMNS).where({ "email": email }).whereNull("deleted_at").first();
    if (!row) {
        return undefined;
    }
    console.log("row", row);
    return row ? toEntity(row) : undefined;
}

export async function crreateUser(user: Partial<User>): Promise<User> {
    const [row] = await db("users").insert({
        email: user.email,
        phone: user.phone,
        password_hash: user.passwordHash,
        system_role: user.systemRole,
        created_at: user.createdAt,
        updated_at: user.updatedAt,
        deleted_at: user.deletedAt
    }).returning(USER_COLUMNS);
    return toEntity(row);
}