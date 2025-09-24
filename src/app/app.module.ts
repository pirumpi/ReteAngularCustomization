import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { AppComponent } from "./app.component";
import { CustomSocketComponent } from "./custom-socket/custom-socket.component";
import { CustomNodeComponent } from "./custom-node/custom-node.component";
import { CustomConnectionComponent } from "./custom-connection/custom-connection.component";

import { ReteModule } from "rete-angular-plugin/18";

@NgModule({
  declarations: [
    AppComponent,
    CustomSocketComponent,
    CustomNodeComponent,
    CustomConnectionComponent,
  ],
  imports: [BrowserModule, CommonModule, ReteModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
