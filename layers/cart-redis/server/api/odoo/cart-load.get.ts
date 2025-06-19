import type { Endpoints } from "@erpgap/odoo-sdk-api-client";

export default defineEventHandler(async (event: any) => {

  const userCookie = getCookie(event, 'odoo-user')
  const session = await useSession(event, {
    password: "b013b03ac2231e0b448e9a22ba488dcf",
  });
  const keyName = userCookie ? `cache:cart:id:${userCookie}` : `cache:cart:session:${session?.id}`
  const data = await useStorage().getItem(keyName);

  return data;
});
