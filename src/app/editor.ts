import { Injector } from "@angular/core";
import { NodeEditor, GetSchemes, ClassicPreset } from "rete";
import { AreaPlugin, AreaExtensions } from "rete-area-plugin";
import {
  ConnectionPlugin,
  Presets as ConnectionPresets,
} from "rete-connection-plugin";
import { AngularPlugin, Presets, AngularArea2D } from "rete-angular-plugin/18";
import { CustomSocketComponent } from "./custom-socket/custom-socket.component";
import { CustomNodeComponent } from "./custom-node/custom-node.component";
import { CustomConnectionComponent } from "./custom-connection/custom-connection.component";
import { addCustomBackground } from "./custom-background";

type Schemes = GetSchemes<
  ClassicPreset.Node,
  ClassicPreset.Connection<ClassicPreset.Node, ClassicPreset.Node>
>;
type AreaExtra = AngularArea2D<Schemes>;

export async function createEditor(container: HTMLElement, injector: Injector) {
  const socket = new ClassicPreset.Socket("socket");

  const editor = new NodeEditor<Schemes>();
  const area = new AreaPlugin<Schemes, AreaExtra>(container);
  const connection = new ConnectionPlugin<Schemes, AreaExtra>();
  const render = new AngularPlugin<Schemes, AreaExtra>({ injector });

  AreaExtensions.selectableNodes(area, AreaExtensions.selector(), {
    accumulating: AreaExtensions.accumulateOnCtrl(),
  });

  render.addPreset(
    Presets.classic.setup({
      customize: {
        node() {
          return CustomNodeComponent;
        },
        connection() {
          return CustomConnectionComponent;
        },
        socket() {
          return CustomSocketComponent;
        },
      },
    })
  );

  connection.addPreset(ConnectionPresets.classic.setup());

  addCustomBackground(area);

  editor.use(area);
  area.use(connection);
  area.use(render);

  area.addPipe((c) => {
    if (c.type === "render") console.log(c.data);
    return c;
  });

  AreaExtensions.simpleNodesOrder(area);

  const a = new ClassicPreset.Node("Custom");
  a.addOutput("a", new ClassicPreset.Output(socket));
  a.addInput("a", new ClassicPreset.Input(socket));
  await editor.addNode(a);

  const b = new ClassicPreset.Node("Custom");
  b.addOutput("a", new ClassicPreset.Output(socket));
  b.addInput("a", new ClassicPreset.Input(socket));
  await editor.addNode(b);

  await area.translate(b.id, { x: 320, y: 0 });

  await editor.addConnection(new ClassicPreset.Connection(a, "a", b, "a"));

  AreaExtensions.zoomAt(area, editor.getNodes());

  return () => area.destroy();
}
