import { App } from "@/app";
import { connectDatabase } from "@/configs/database";
import { AuthRoute } from "@/routes/auth.route";
import { UserRoute } from "@/routes/users.route";

(async () => {
  await connectDatabase();

  const app = new App([new AuthRoute(), new UserRoute()]);
  app.listen();
})();
