import React from "react";
import CognitiveCubeMatrix from "@/components/visuals/CognitiveCubeMatrix";
import AlterEngineAssembly from "@/components/visuals/AlterEngineAssembly";
import CustomWorkflowStack from "@/components/visuals/CustomWorkflowStack";
import BuildWithAlterXGrid from "@/components/visuals/BuildWithAlterXGrid";

/*
  Large reactive product visuals for the "One Engine" section — the shared
  AlterX 3D object family (same system used in the mega-menu previews), not
  flat line-art. `active` maps to the object's tile-specific state; idle
  tiles sit at "rest". Each tile gets a distinct behaviour, not an identical
  cube: Alter Engine assembles to its core, Custom workflows assembles to an
  approval boundary, Cognitive AI is the stacked-inventory object, Build
  with AlterX is the wireframe core.
*/
// Black visual stage — kept consistent regardless of the tile's own
// surface color (two tiles are light, two are dark), so the orange 3D
// object always reads against dark ground per the shared material system.
const Stage = ({ children }) => (
  <div className="relative w-full h-full rounded-[6px] overflow-hidden" style={{ background: "radial-gradient(circle at 50% 46%, rgba(249,115,22,.14) 0%, rgba(249,115,22,.045) 25%, transparent 48%), #090909" }}>
    {children}
  </div>
);

export const AlterEngineVisual = ({ active }) => (
  <Stage><AlterEngineAssembly active={active} size="tile" /></Stage>
);

export const CognitiveVisual = ({ active }) => (
  <Stage><CognitiveCubeMatrix active={active} size="home" /></Stage>
);

export const WorkflowsVisual = ({ active }) => (
  <Stage><CustomWorkflowStack active={active} size="tile" /></Stage>
);

export const BuildVisual = ({ active }) => (
  <Stage><BuildWithAlterXGrid active={active} size="tile" /></Stage>
);

export const PRODUCT_VISUALS = {
  engine: AlterEngineVisual,
  cognitive: CognitiveVisual,
  workflows: WorkflowsVisual,
  build: BuildVisual,
};
