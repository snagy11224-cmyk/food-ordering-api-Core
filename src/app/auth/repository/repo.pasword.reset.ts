import { PasswordReset } from "../entity/password.reset.entity"
import {db} from "../../../common/knex/knex"

const PASSWORD_RESET_COLUMNS = [
    "id",
    "user_id",    
    "otp_hash",
    "expires_at",
    "cinsumed_at",
    "created_at"
]

function toEntity(row: any): PasswordReset {
    return new PasswordReset({
        id: row.id,
        userId: row.user_id,
        otpHash: row.otp_hash,
        expiresAt:row.expires_at,
        consumedAt: row.consumed_at,
        createdAt: row.created_at,
    })
}

export async function createPasswordReset(PasswordReset: Partial<PasswordReset>){

await db("password_resets").insert({
user_id:PasswordReset.userId,
otp_hash:PasswordReset.otpHash,
expires_at:PasswordReset.expiresAt,
consumed_at:PasswordReset.consumedAt,
created_at:PasswordReset.createdAt
})
}