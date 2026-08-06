import { bootstrapObserver, cleanupObserver } from "./observers/bodyObserver";
import { removeWidget } from "./widget/inject";
import "./router";

function bootstrap() {
  bootstrapObserver();
}

window.addEventListener("beforeunload", () => {
  cleanupObserver();
  removeWidget();
});

bootstrap();
