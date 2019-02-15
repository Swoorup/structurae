const UnweightedGraph = require('../lib/unweighted-graph');

describe('UnweightedGraph', () => {
  let graph;
  beforeEach(() => {
    graph = new UnweightedGraph({ size: 106, directed: true });
    graph.addEdge(0, 1);
    graph.addEdge(0, 2);
    graph.addEdge(0, 3);
    graph.addEdge(2, 4);
    graph.addEdge(2, 5);
  });

  describe('addEdge', () => {
    it('', () => {
      expect(graph.hasEdge(0, 5)).toBe(false);
      graph.addEdge(0, 5);
      expect(graph.hasEdge(0, 5)).toBe(true);
    });

    it('', () => {
      const directedGraph = new UnweightedGraph({ size: 8 });
      expect(directedGraph.hasEdge(0, 5)).toBe(false);
      expect(directedGraph.hasEdge(5, 0)).toBe(false);
      directedGraph.addEdge(0, 5);
      expect(directedGraph.hasEdge(0, 5)).toBe(true);
      expect(directedGraph.hasEdge(5, 0)).toBe(true);
    });
  });

  describe('removeEdge', () => {
    it('', () => {
      expect(graph.hasEdge(0, 1)).toBe(true);
      graph.removeEdge(0, 1);
      expect(graph.hasEdge(0, 1)).toBe(false);
    });

    it('', () => {
      const directedGraph = new UnweightedGraph({ size: 8 });
      directedGraph.addEdge(0, 5);
      expect(directedGraph.hasEdge(0, 5)).toBe(true);
      expect(directedGraph.hasEdge(5, 0)).toBe(true);
      directedGraph.removeEdge(0, 5);
      expect(directedGraph.hasEdge(0, 5)).toBe(false);
      expect(directedGraph.hasEdge(5, 0)).toBe(false);
    });
  });

  describe('outEdges', () => {
    it('', () => {
      expect(graph.outEdges(0)).toEqual([1, 2, 3]);
    });
  });

  describe('inEdges', () => {
    it('', () => {
      expect(graph.inEdges(1)).toEqual([0]);
    });
  });

  describe('hasEdges', () => {
    it('', () => {
      expect(graph.hasEdge(0, 1)).toBe(true);
      expect(graph.hasEdge(0, 5)).toBe(false);
      expect(graph.hasEdge(2, 5)).toBe(true);
    });
  });

  describe('traverse', () => {
    it('does a Breadth First Search on the graph', () => {
      const bfs = [...graph.traverse()];
      expect(bfs).toEqual([0, 1, 2, 3, 4, 5]);
    });

    it('does a Depth First Search on the graph if `isDFS=true`', () => {
      const dfs = [...graph.traverse(true)];
      expect(dfs).toEqual([0, 3, 2, 5, 4, 1]);
    });

    it('yields edging vertexes if `white=true`', () => {
      const bfs = [...graph.traverse(false, 0, false, true)];
      expect(bfs).toEqual([1, 2, 3, 4, 5]);
    });

    it('yields fully processed vertexes if `black=true`', () => {
      const bfs = [...graph.traverse(false, 0, false, false, true)];
      expect(bfs).toEqual([0, 1, 2, 3, 4, 5]);
    });
  });

  describe('path', () => {
    it('finds the shortest path between two vertexes', () => {
      const path = graph.path(0, 5);
      expect(path).toEqual([0, 2, 5]);
    });

    it('returns an empty array if no path is found', () => {
      const path = graph.path(3, 5);
      expect(path).toEqual([]);
    });
  });

  describe('resetColors', () => {
    it('sets color of all vertexes to white', () => {
      expect(graph.isBlack(0)).toBe(false);
      expect(graph.isBlack(5)).toBe(false);
      const bfs = [...graph.traverse()];
      expect(graph.isBlack(0)).toBe(true);
      expect(graph.isBlack(5)).toBe(true);
      graph.resetColors();
      expect(graph.isBlack(0)).toBe(false);
      expect(graph.isBlack(5)).toBe(false);
    });
  });

  describe('isAcyclic', () => {
    it('checks whether the graph is acyclic', () => {
      expect(graph.isAcyclic()).toBe(true);
      graph.addEdge(1, 0);
      expect(graph.isAcyclic()).toBe(false);
      graph.removeEdge(1, 0);
      expect(graph.isAcyclic()).toBe(true);
      graph.addEdge(5, 0);
      expect(graph.isAcyclic()).toBe(false);
      graph.removeEdge(5, 0);
      expect(graph.isAcyclic()).toBe(true);
      graph.addEdge(5, 3).addEdge(3, 2);
      expect(graph.isAcyclic()).toBe(false);
    });
  });

  describe('topologicalSort', () => {
    it('returns a list of vertexes sorted topologically', () => {
      expect(graph.topologicalSort()).toEqual([0, 3, 2, 5, 4, 1]);
    });
  });
});
