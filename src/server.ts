import { App } from "@/app";
import { connectDatabase } from "@/configs/database";
import { AuthRoute } from "@/modules/auth/auth.route";
import { UserRoute } from "@/modules/user/user.route";
import { UploadRoute } from "@/modules/upload/upload.route";

(async () => {
  await connectDatabase();

  const app = new App([new AuthRoute(), new UserRoute(), new UploadRoute()]);

  await app.initializeMinio();

  app.listen();
})();
