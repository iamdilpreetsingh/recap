import { bootstrapObserver, cleanupObserver } from "./observers/bodyObserver";
import { removeWidget } from "./widget/inject";
import { injectStaticHideStyles } from "./captions";
import "./router";

function bootstrap() {
  injectStaticHideStyles();
  bootstrapObserver();
}

window.addEventListener("beforeunload", () => {
  cleanupObserver();
  removeWidget();
});

bootstrap();
