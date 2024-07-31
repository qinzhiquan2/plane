function dijkstra(graph, start) {  
    const distances = {}; // 存储从起点到每个点的最短距离  
    const pq = []; // 优先队列，用于存储待处理的节点  
  
    // 初始化距离和优先队列  
    for (const vertex in graph) {  
        if (graph.hasOwnProperty(vertex)) {  
            distances[vertex] = Infinity;  
            pq.push([Infinity, vertex]); // 初始时，距离设置为无穷大  
        }  
    }  
    console.log(pq)
    console.log(distances)
  
    distances[start] = 0; // 起点到自身的距离为0  
    pq[pq.findIndex(([_, v]) => v === start)][0] = 0; // 将起点的距离更新为0，并调整优先队列  
    console.log(pq)
  
    // Dijkstra算法主循环  
    while (pq.length > 0) {  
        // 提取当前距离最小的节点  
        pq.sort((a, b) => a[0] - b[0]); // 按距离排序  
        const [currentDistance, currentVertex] = pq.shift(); // 弹出距离最小的节点  
  
        // 节点可能已经被处理过（因为相同距离的节点排序可能不稳定）  
        if (currentDistance > distances[currentVertex]) {  
            continue;  
        }  
  
        // 遍历当前节点的所有邻接节点  
        for (const [neighbor, weight] of graph[currentVertex]) {  
            const distance = currentDistance + weight;  
  
            // 如果找到了更短的路径，则更新距离，并调整优先队列  
            if (distance < distances[neighbor]) {  
                distances[neighbor] = distance;  
                // 注意：这里我们直接插入新距离，而不是替换旧元素，因为pq可能包含多个相同节点  
                pq.push([distance, neighbor]);  
            }  
        }  
    }  
  
    return distances;  
}  
  
// 示例图（有向图）  
const graph = {  
    'A': [['B', 10], ['C', 4]],  
    'B': [['A', 10], ['C', 2], ['D', 5]],  
    'C': [['A', 4], ['B', 2], ['D', 1]],  
    'D': [['B', 5], ['C', 1]]  
};  
  
// 从节点'A'开始寻找最短路径  
console.log(dijkstra(graph, 'A'));