import {
  assert,
  assertEquals,
} from "https://deno.land/std@0.98.0/testing/asserts.ts";
import * as index from "../index.ts";

const { test } = Deno;

test("Public API Assertions", () => {
  assert(index != null);
  assertEquals(typeof index.AdjacencyListMixin, "function");
  assertEquals(typeof index.AdjacencyMatrixUnweightedDirected, "function");
  assertEquals(typeof index.AdjacencyMatrixUnweightedUndirected, "function");
  assertEquals(typeof index.AdjacencyMatrixWeightedDirectedMixin, "function");
  assertEquals(typeof index.AdjacencyMatrixWeightedUndirectedMixin, "function");
  assertEquals(typeof index.ArrayView, "function");
  assertEquals(typeof index.BigBitFieldMixin, "function");
  assertEquals(typeof index.BinaryGrid, "function");
  assertEquals(typeof index.BinaryHeap, "function");
  assertEquals(typeof index.BitArray, "function");
  assertEquals(typeof index.BitFieldMixin, "function");
  assertEquals(typeof index.BooleanView, "function");
  assertEquals(typeof index.GraphMixin, "function");
  assertEquals(typeof index.GridMixin, "function");
  assertEquals(typeof index.MapView, "function");
  assertEquals(typeof index.BigInt64View, "function");
  assertEquals(typeof index.BigUint64View, "function");
  assertEquals(typeof index.Float32View, "function");
  assertEquals(typeof index.Float64View, "function");
  assertEquals(typeof index.Int16View, "function");
  assertEquals(typeof index.Int32View, "function");
  assertEquals(typeof index.Int8View, "function");
  assertEquals(typeof index.Uint16View, "function");
  assertEquals(typeof index.Uint32View, "function");
  assertEquals(typeof index.Uint8View, "function");
  assertEquals(typeof index.ObjectView, "function");
  assertEquals(typeof index.Pool, "function");
  assertEquals(typeof index.RankedBitArray, "function");
  assertEquals(typeof index.SortedArray, "function");
  assertEquals(typeof index.StringView, "function");
  assertEquals(typeof index.SymmetricGridMixin, "function");
  assertEquals(typeof index.VectorView, "function");
  assertEquals(typeof index.getBitSize, "function");
  assertEquals(typeof index.getLog2, "function");
  assertEquals(typeof index.getLSBIndex, "function");
  assertEquals(typeof index.popCount32, "function");
  assertEquals(typeof index.View, "function");
});
