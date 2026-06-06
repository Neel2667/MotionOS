import { MotionGraph } from '../core/MotionGraph';
import { TimelineSegment } from './Sequencer';
import { CustomBlockType } from './MotionBlock';
import { RotateNode } from '../nodes/RotateNode';
import { ScaleNode } from '../nodes/ScaleNode';
import { OpacityNode } from '../nodes/OpacityNode';
import { DelayNode } from '../nodes/DelayNode';

export class MotionGraphBuilder {
  build(segments: TimelineSegment[]): MotionGraph {
    const graph = new MotionGraph();

    // Loop through blocks and translate to concrete node rigs
    for (const seg of segments) {
      for (const block of seg.blocks) {
        let node: any = null;

        switch (block.type) {
          case CustomBlockType.ROTATE:
          case CustomBlockType.ORBIT:
            const rot = new RotateNode();
            rot.name = block.name;
            rot.parameters = {
              targetName: 'Logo',
              x: block.parameters.axis === 'x' ? block.intensity : 0,
              y: block.parameters.axis === 'y' ? block.intensity : 1,
              z: block.parameters.axis === 'z' ? block.intensity : 0,
              speed: block.parameters.speed || 1.0
            };
            node = rot;
            break;

          case CustomBlockType.SCALE:
            const scale = new ScaleNode();
            scale.name = block.name;
            scale.parameters = {
              targetName: 'Logo',
              startValue: block.parameters.from !== undefined ? block.parameters.from : 0.1,
              endValue: block.parameters.to !== undefined ? block.parameters.to : 1.2,
              duration: block.duration,
              delay: block.delay
            };
            node = scale;
            break;

          case CustomBlockType.REVEAL:
          case CustomBlockType.GLOW:
          case CustomBlockType.PULSE:
            const opacity = new OpacityNode();
            opacity.name = block.name;
            opacity.parameters = {
              targetName: 'Logo',
              startValue: 0.1,
              endValue: block.intensity,
              duration: block.duration,
              delay: block.delay
            };
            node = opacity;
            break;

          default:
            // Custom Delay / Logic
            const delay = new DelayNode();
            delay.name = block.name;
            delay.parameters = { duration: block.duration };
            node = delay;
            break;
        }

        if (node) {
          node.enabled = true;
          graph.addNode(node);
        }
      }
    }

    // Connect them in a basic dependency chain for serializability
    for (let i = 0; i < graph.nodes.length - 1; i++) {
      const source = graph.nodes[i];
      const target = graph.nodes[i + 1];
      if (source.outputs.length && target.inputs.length) {
        graph.connect(source.id, source.outputs[0].id, target.id, target.inputs[0].id);
      } else {
        // Fallback connections
        graph.connect(source.id, 'out', target.id, 'in');
      }
    }

    return graph;
  }
}
