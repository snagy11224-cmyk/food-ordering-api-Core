import {  plainToInstance } from "class-transformer";
import { validate } from "class-validator";

export async function validateBody<T extends object>(
  cls: new () => T,
  body: unknown
): Promise<T> {

  const instance = plainToInstance(cls, body);

  const errors = await validate(instance, {
    whitelist: true
  });

  if (errors.length > 0) {

    const messages = errors.flatMap(
      e => Object.values(e.constraints ?? {})
    );

    throw new Error(messages.join(", "));
  }

  return instance;
}