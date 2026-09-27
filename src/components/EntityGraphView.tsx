import React, { useState, useMemo } from 'react';
import {
  Share2,
  ZoomIn,
  ZoomOut,
  Maximize2,
  RefreshCw,
  Info,
  CheckCircle2,
  AlertCircle,
  Building2,
  MapPin,
  GitCommit,
  Layers,
  ArrowRight,
  Filter
} from 'lucide-react';
import { EntityMatchResult } from '../types/entity';

interface EntityGraphViewProps {
  testEntities: EntityMatchResult[];
  onOpenEntityDetail: (entityId: string) => void;
}

interface GraphNode {
  id: string;
  name: string;
  source: 'S1' | 'S2' | 'S3';
  address: string;
  city: string;
  country: string;
  x: number;
  y: number;
  isSingleton?: boolean;
}

interface GraphEdge {
  sourceId: string;
  targetId: string;
  confidence: number;
  status: 'MATCH' | 'NO MATCH';
  variationType: string;
}

export const EntityGraphView: React.FC<EntityGraphViewProps> = ({
  testEntities,
  onOpenEntityDetail
}) => {
  // Graph controls
  const [selectedS1Id, setSelectedS1Id] = useState<string>('S1-00002');
  const [viewMode, setViewMode] = useState<'ego' | 'cluster'>('ego');
  const [minConfidenceFilter, setMinConfidenceFilter] = useState<number>(0.0);
  const [zoomLevel, setZoomLevel] = useState<number>(1.0);
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [hoveredEdge, setHoveredEdge] = useState<GraphEdge | null>(null);

  // Entities with multiple matches to show interesting graphs
  const multiMatchEntities = useMemo(() => {
    return testEntities.filter((e) => !e.isSingleton && e.matchCount >= 2);
  }, [testEntities]);

  // Selected S1 record
  const currentEntity = useMemo(() => {
    return testEntities.find((e) => e.source1Entity.id === selectedS1Id) || testEntities[0];
  }, [testEntities, selectedS1Id]);

  // Generate graph nodes and edges based on viewMode
  const graphData = useMemo(() => {
    const nodes: GraphNode[] = [];
    const edges: GraphEdge[] = [];

    if (viewMode === 'ego') {
      // Ego Network for current selected entity
      if (!currentEntity) return { nodes: [], edges: [] };

      const centerX = 400;
      const centerY = 260;

      // Central S1 node
      const centerNode: GraphNode = {
        id: currentEntity.source1Entity.id,
        name: currentEntity.source1Entity.name,
        source: 'S1',
        address: currentEntity.source1Entity.address,
        city: currentEntity.source1Entity.city,
        country: currentEntity.source1Entity.country,
        x: centerX,
        y: centerY,
        isSingleton: currentEntity.isSingleton
      };
      nodes.push(centerNode);

      // Connected candidates from S2 and S3
      const candidates = currentEntity.matchedEntities;
      const totalCandidates = candidates.length;

      if (totalCandidates === 0) {
        // If singleton, add 1-2 rejected candidate ghost nodes to demonstrate why it didn't match
        const rejectedGhost: GraphNode = {
          id: 'S2-09941',
          name: `${currentEntity.source1Entity.name.split(' ')[0]} Innovations Unrelated`,
          source: 'S2',
          address: '44 Industrial Way, Unit 9',
          city: currentEntity.source1Entity.city,
          country: currentEntity.source1Entity.country,
          x: centerX + 180,
          y: centerY - 80
        };
        nodes.push(rejectedGhost);
        edges.push({
          sourceId: centerNode.id,
          targetId: rejectedGhost.id,
          confidence: 0.38,
          status: 'NO MATCH',
          variationType: 'Below Threshold (< 0.50)'
        });
      } else {
        const radius = 180;
        candidates.forEach((cand, idx) => {
          if (cand.similarityScore < minConfidenceFilter) return;

          const angle = (idx * 2 * Math.PI) / totalCandidates - Math.PI / 2;
          const nodeX = centerX + radius * Math.cos(angle);
          const nodeY = centerY + radius * Math.sin(angle);

          const candNode: GraphNode = {
            id: cand.id,
            name: cand.name,
            source: cand.source,
            address: cand.address,
            city: cand.city,
            country: cand.country,
            x: nodeX,
            y: nodeY
          };
          nodes.push(candNode);

          edges.push({
            sourceId: centerNode.id,
            targetId: cand.id,
            confidence: cand.similarityScore,
            status: cand.similarityScore >= 0.50 ? 'MATCH' : 'NO MATCH',
            variationType: cand.variationType
          });
        });
      }
    } else {
      // Cluster Network mode: render 5 multi-entity business clusters
      const clusterCenters = [
        { id: 'S1-00002', cx: 200, cy: 160 },
        { id: 'S1-00003', cx: 580, cy: 160 },
        { id: 'S1-00005', cx: 220, cy: 380 },
        { id: 'S1-00007', cx: 600, cy: 380 },
        { id: 'S1-00008', cx: 400, cy: 260 }
      ];

      clusterCenters.forEach((cluster) => {
        const ent = testEntities.find((e) => e.source1Entity.id === cluster.id);
        if (!ent) return;

        const s1Node: GraphNode = {
          id: ent.source1Entity.id,
          name: ent.source1Entity.name,
          source: 'S1',
          address: ent.source1Entity.address,
          city: ent.source1Entity.city,
          country: ent.source1Entity.country,
          x: cluster.cx,
          y: cluster.cy
        };
        nodes.push(s1Node);

        ent.matchedEntities.forEach((cand, cIdx) => {
          if (cand.similarityScore < minConfidenceFilter) return;

          const angle = (cIdx * 2 * Math.PI) / Math.max(1, ent.matchedEntities.length);
          const dist = 75;
          const cX = cluster.cx + dist * Math.cos(angle);
          const cY = cluster.cy + dist * Math.sin(angle);

          const cNode: GraphNode = {
            id: cand.id,
            name: cand.name,
            source: cand.source,
            address: cand.address,
            city: cand.city,
            country: cand.country,
            x: cX,
            y: cY
          };
          nodes.push(cNode);

          edges.push({
            sourceId: s1Node.id,
            targetId: cand.id,
            confidence: cand.similarityScore,
            status: 'MATCH',
            variationType: cand.variationType
          });
        });
      });
    }

    return { nodes, edges };
  }, [viewMode, currentEntity, testEntities, minConfidenceFilter]);

  // Color helper according to user prompt specification:
  // Green = High confidence match (>0.85)
  // Teal = Medium confidence match (0.60–0.85)
  // Orange = Low confidence / Review (<0.60)
  const getEdgeColor = (confidence: number) => {
    if (confidence > 0.85) return '#16B981'; // Green
    if (confidence >= 0.60) return '#12B8A6'; // Teal
    return '#F59E0B'; // Orange
  };

  const getEdgeWidth = (confidence: number) => {
    return Math.max(2, Math.min(5, confidence * 4.5));
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="bg-white border border-[#DCE5F0] rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-bold text-[#146EF5] mb-1">
              <span>MODULE 03</span>
              <span className="text-slate-300">·</span>
              <span>MULTI-SOURCE RELATIONSHIP GRAPH</span>
            </div>
            <h2 className="text-xl font-bold text-[#12213A] tracking-tight">
              Interactive Entity Linkage &amp; Cluster Network
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-600 leading-relaxed">
              Explore interconnected enterprise clusters across Source 1 (Reference Ground), Source 2 (Noisy), and Source 3 (Noisy). Edge weights and colors visualize model match probabilities.
            </p>
          </div>

          {/* Mode Toggle */}
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl self-start md:self-auto">
            <button
              onClick={() => setViewMode('ego')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'ego'
                  ? 'bg-white text-[#146EF5] shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-[#12213A]'
              }`}
            >
              Single Entity Star Graph
            </button>
            <button
              onClick={() => setViewMode('cluster')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'cluster'
                  ? 'bg-white text-[#7C5CFC] shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-[#12213A]'
              }`}
            >
              Multi-Entity Cluster Network
            </button>
          </div>
        </div>
      </div>

      {/* 2. Controls & Entity Selector Bar */}
      <div className="bg-white border border-[#DCE5F0] rounded-2xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-4 text-xs">
        {/* Left: Entity Selector */}
        {viewMode === 'ego' ? (
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">Focus Entity:</span>
            <select
              value={selectedS1Id}
              onChange={(e) => setSelectedS1Id(e.target.value)}
              className="py-1.5 px-3 rounded-lg bg-slate-50 border border-[#DCE5F0] font-mono font-bold text-[#12213A] focus:outline-hidden focus:ring-2 focus:ring-[#146EF5]"
            >
              {testEntities.slice(0, 50).map((ent) => (
                <option key={ent.source1Entity.id} value={ent.source1Entity.id}>
                  {ent.source1Entity.id} · {ent.source1Entity.name.slice(0, 30)} ({ent.matchCount} links)
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-slate-600 font-medium">
            <Layers className="w-4 h-4 text-[#7C5CFC]" />
            <span>Showing 5 Connected Enterprise Jurisdictional Clusters</span>
          </div>
        )}

        {/* Center: Confidence Threshold Filter Slider */}
        <div className="flex items-center gap-3">
          <span className="text-slate-500 font-medium">
            Min Score: <strong className="font-mono text-[#146EF5]">{Math.round(minConfidenceFilter * 100)}%</strong>
          </span>
          <input
            type="range"
            min="0.0"
            max="0.90"
            step="0.05"
            value={minConfidenceFilter}
            onChange={(e) => setMinConfidenceFilter(parseFloat(e.target.value))}
            className="w-28 sm:w-36 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#146EF5]"
          />
          {minConfidenceFilter > 0 && (
            <button
              onClick={() => setMinConfidenceFilter(0)}
              className="text-[11px] text-slate-400 hover:text-slate-700 underline"
            >
              Clear
            </button>
          )}
        </div>

        {/* Right: Legend */}
        <div className="flex items-center gap-3 font-medium text-[11px] text-slate-600">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#16B981]"></span>
            <span>&gt;0.85 High Match</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#12B8A6]"></span>
            <span>0.60–0.85 Medium</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]"></span>
            <span>&lt;0.60 Review</span>
          </span>
        </div>
      </div>

      {/* 3. Main Interactive Graph Canvas & Side Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* SVG Canvas */}
        <div className="lg:col-span-8 bg-white border border-[#DCE5F0] rounded-2xl shadow-xs p-4 overflow-hidden relative min-h-[540px]">
          {/* Zoom & Canvas Controls */}
          <div className="absolute top-6 right-6 z-10 flex flex-col gap-1.5 bg-white/90 backdrop-blur-xs p-1.5 rounded-xl border border-[#DCE5F0] shadow-xs">
            <button
              onClick={() => setZoomLevel((z) => Math.min(1.8, z + 0.15))}
              className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoomLevel((z) => Math.max(0.6, z - 0.15))}
              className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoomLevel(1.0)}
              className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100"
              title="Reset Zoom"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {/* Node Legend Chips on top left */}
          <div className="absolute top-6 left-6 z-10 flex flex-wrap gap-2 text-[11px] font-semibold">
            <span className="px-2.5 py-1 rounded-lg bg-[#12213A] text-white flex items-center gap-1.5 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#146EF5]"></span>
              <span>Source 1 (Ref)</span>
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-teal-50 text-[#12B8A6] border border-teal-200 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#12B8A6]"></span>
              <span>Source 2</span>
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-purple-50 text-[#7C5CFC] border border-purple-200 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#7C5CFC]"></span>
              <span>Source 3</span>
            </span>
          </div>

          {/* SVG Viewport */}
          <svg
            viewBox="0 0 800 520"
            className="w-full h-[500px] select-none cursor-grab active:cursor-grabbing"
            style={{
              transform: `scale(${zoomLevel})`,
              transformOrigin: 'center center',
              transition: 'transform 0.15s ease-out'
            }}
          >
            {/* Background Grid Pattern */}
            <defs>
              <pattern id="graphGrid" width="30" height="30" patternUnits="userSpaceOnUse">
                <circle cx="15" cy="15" r="1" fill="#E2E8F0" />
              </pattern>
            </defs>
            <rect width="800" height="520" fill="url(#graphGrid)" />

            {/* Edges */}
            {graphData.edges.map((edge, i) => {
              const src = graphData.nodes.find((n) => n.id === edge.sourceId);
              const tgt = graphData.nodes.find((n) => n.id === edge.targetId);
              if (!src || !tgt) return null;

              const isEdgeHovered = hoveredEdge === edge;
              const color = getEdgeColor(edge.confidence);
              const strokeW = getEdgeWidth(edge.confidence);

              return (
                <g key={i}>
                  {/* Invisible thicker line for hover targeting */}
                  <line
                    x1={src.x}
                    y1={src.y}
                    x2={tgt.x}
                    y2={tgt.y}
                    stroke="transparent"
                    strokeWidth="16"
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredEdge(edge)}
                    onMouseLeave={() => setHoveredEdge(null)}
                  />
                  {/* Rendered Edge */}
                  <line
                    x1={src.x}
                    y1={src.y}
                    x2={tgt.x}
                    y2={tgt.y}
                    stroke={color}
                    strokeWidth={isEdgeHovered ? strokeW + 2 : strokeW}
                    strokeDasharray={edge.status === 'NO MATCH' ? '4 4' : undefined}
                    opacity={isEdgeHovered ? 1 : 0.85}
                    className="transition-all"
                  />
                  {/* Edge Midpoint Label */}
                  <rect
                    x={(src.x + tgt.x) / 2 - 18}
                    y={(src.y + tgt.y) / 2 - 9}
                    width="36"
                    height="18"
                    rx="4"
                    fill="white"
                    stroke={color}
                    strokeWidth="1"
                  />
                  <text
                    x={(src.x + tgt.x) / 2}
                    y={(src.y + tgt.y) / 2 + 3}
                    textAnchor="middle"
                    fontSize="9"
                    fontWeight="bold"
                    fontFamily="monospace"
                    fill={color}
                  >
                    {Math.round(edge.confidence * 100)}%
                  </text>
                </g>
              );
            })}

            {/* Nodes */}
            {graphData.nodes.map((node) => {
              const isCenter = node.source === 'S1';
              const isHovered = hoveredNode?.id === node.id;
              const isSelected = selectedNode?.id === node.id;

              let fillColor = '#12213A'; // S1 Navy
              let strokeColor = '#146EF5';
              let radius = 28;

              if (node.source === 'S2') {
                fillColor = '#0F766E'; // Teal 700
                strokeColor = '#12B8A6';
                radius = 22;
              } else if (node.source === 'S3') {
                fillColor = '#5B21B6'; // Purple 700
                strokeColor = '#7C5CFC';
                radius = 22;
              }

              return (
                <g
                  key={node.id}
                  className="cursor-pointer transition-all"
                  onClick={() => setSelectedNode(node)}
                  onMouseEnter={() => setHoveredNode(node)}
                  onMouseLeave={() => setHoveredNode(null)}
                >
                  {/* Halo ring when hovered or selected */}
                  {(isHovered || isSelected) && (
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={radius + 8}
                      fill={strokeColor}
                      opacity="0.2"
                      className="animate-pulse"
                    />
                  )}

                  {/* Node Circle */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={radius}
                    fill={fillColor}
                    stroke={isSelected ? '#146EF5' : strokeColor}
                    strokeWidth={isSelected ? '3' : '2'}
                    className="shadow-md"
                  />

                  {/* Node Label Text */}
                  <text
                    x={node.x}
                    y={node.y - 2}
                    textAnchor="middle"
                    fill="white"
                    fontSize={isCenter ? '10' : '9'}
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    {node.id}
                  </text>
                  <text
                    x={node.x}
                    y={node.y + 11}
                    textAnchor="middle"
                    fill="#E2E8F0"
                    fontSize="7.5"
                    fontWeight="600"
                  >
                    {node.country}
                  </text>

                  {/* Name pill below node */}
                  <rect
                    x={node.x - 55}
                    y={node.y + radius + 4}
                    width="110"
                    height="16"
                    rx="4"
                    fill="white"
                    stroke="#DCE5F0"
                    strokeWidth="1"
                    opacity="0.95"
                  />
                  <text
                    x={node.x}
                    y={node.y + radius + 15}
                    textAnchor="middle"
                    fill="#12213A"
                    fontSize="8.5"
                    fontWeight="bold"
                    className="truncate"
                  >
                    {node.name.length > 18 ? `${node.name.slice(0, 16)}...` : node.name}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Interactive Edge Hover Tooltip */}
          {hoveredEdge && (
            <div className="absolute bottom-6 left-6 z-20 bg-white/95 backdrop-blur-md border border-[#DCE5F0] rounded-xl p-3 shadow-lg text-xs space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#12213A]">
                  Link: {hoveredEdge.sourceId} &rarr; {hoveredEdge.targetId}
                </span>
                <span className="font-mono font-bold text-xs px-1.5 py-0.5 rounded text-white" style={{ backgroundColor: getEdgeColor(hoveredEdge.confidence) }}>
                  {Math.round(hoveredEdge.confidence * 100)}%
                </span>
              </div>
              <div className="text-[11px] text-slate-500 font-medium">
                Variation: {hoveredEdge.variationType} · Status: <strong>{hoveredEdge.status}</strong>
              </div>
            </div>
          )}
        </div>

        {/* Right Inspector Panel */}
        <div className="lg:col-span-4 bg-white border border-[#DCE5F0] rounded-2xl shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#DCE5F0]">
            <div>
              <div className="text-[10px] font-mono font-bold text-[#146EF5] uppercase tracking-wider">
                Graph Node Inspector
              </div>
              <h3 className="text-sm font-bold text-[#12213A]">
                {selectedNode ? selectedNode.id : hoveredNode ? hoveredNode.id : 'Click Any Node'}
              </h3>
            </div>
            {(selectedNode || hoveredNode) && (
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                {(selectedNode || hoveredNode)?.source}
              </span>
            )}
          </div>

          {(selectedNode || hoveredNode) ? (
            <div className="space-y-3.5 text-xs">
              {(() => {
                const node = selectedNode || hoveredNode!;
                return (
                  <>
                    <div className="space-y-1">
                      <div className="text-slate-400 text-[10px] uppercase font-bold">
                        Commercial Title
                      </div>
                      <div className="text-sm font-bold text-[#12213A] leading-snug">
                        {node.name}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="text-slate-400 text-[10px] uppercase font-bold">
                        Location &amp; Country
                      </div>
                      <div className="text-slate-700 flex items-center gap-1.5 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-[#146EF5] shrink-0" />
                        <span>{node.city}, {node.country}</span>
                      </div>
                      <div className="text-slate-500 text-[11px]">
                        {node.address}
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-[#DCE5F0] space-y-1.5 text-[11px]">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Repository Origin:</span>
                        <span className="font-semibold text-[#12213A]">
                          {node.source === 'S1' ? 'Source 1 (Reference Ground)' : node.source === 'S2' ? 'Source 2 (Noisy)' : 'Source 3 (Noisy)'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Node Status:</span>
                        <span className="font-semibold text-[#16B981]">Active Resolution Node</span>
                      </div>
                    </div>

                    {node.source === 'S1' && (
                      <button
                        onClick={() => onOpenEntityDetail(node.id)}
                        className="w-full py-2 px-3 rounded-xl bg-[#146EF5] hover:bg-blue-700 text-white font-semibold flex items-center justify-center gap-1.5 transition-all shadow-xs"
                      >
                        <span>Open Entity Match Inspector</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </>
                );
              })()}
            </div>
          ) : (
            <div className="py-12 text-center text-slate-400 text-xs space-y-2">
              <Share2 className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="font-medium text-slate-600">No node selected</p>
              <p className="text-[11px] text-slate-400">
                Click or hover over any node on the graph canvas to inspect commercial titles, addresses, and confidence weights.
              </p>
            </div>
          )}

          {/* Quick Stats Box */}
          <div className="pt-3 border-t border-[#DCE5F0] space-y-2">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Network Graph Metrics
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2 bg-slate-50 rounded-lg border border-[#DCE5F0]">
                <div className="text-slate-400">Rendered Nodes</div>
                <div className="text-sm font-bold font-mono text-[#12213A]">{graphData.nodes.length}</div>
              </div>
              <div className="p-2 bg-slate-50 rounded-lg border border-[#DCE5F0]">
                <div className="text-slate-400">Active Edges</div>
                <div className="text-sm font-bold font-mono text-[#146EF5]">{graphData.edges.length}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
