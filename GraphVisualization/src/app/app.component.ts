import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';

import { DataSet } from 'vis-data/peer';
import { Network } from 'vis-network';
import { forEach } from 'vis-util';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  @ViewChild('visNetwork', { static: false }) visNetwork!: ElementRef;
  showEditNode = false;
  showEditEdge = false;
  showSaveButton = false;
  showError = false;
  nodeCount!: number;
  edgeControl = new FormControl('');
  nodeControl = new FormControl('');
  nodeIdControl = new FormControl('');
  private networkInstance: any;

  constructor() {}

  ngAfterViewInit(): void {
    this.drawNetwork();
  }

  addNode(): void {
    this.showEditNode = !this.showEditNode;
    this.showSaveButton = false;
    this.showEditEdge = false;
    if (this.showEditNode) {
      this.networkInstance.addNodeMode();
      this.nodeControl.reset();
    }
  }

  editNode(): void {
    this.showEditEdge = false;
    let nodeId = this.networkInstance.getSelectedNodes()[0];

    this.updateNode(nodeId);
  }

  addEdge(): void {
    this.showEditEdge = !this.showEditEdge;
    this.showSaveButton = false;
    this.showEditNode = false;
    if (this.showEditEdge) {
      this.networkInstance.addEdgeMode();
      this.edgeControl.reset();
    }
  }

  editEdge(): void {
    this.showEditNode = false;
    this.networkInstance.editEdgeMode();
  }

  removeSelected(): void {
    this.networkInstance.deleteSelected();
  }

  private drawNetwork(): void {
    var options = {
      interaction: {
        hover: true,
      },
      manipulation: {
        enabled: false,
        addNode: (nodeData: any, callback: any) =>
          this.addNodeCallback(nodeData, callback),
        addEdge: (edgeData: any, callback: any) =>
          this.addEdgeCallback(edgeData, callback),
        editEdge: (edgeData: any, callback: any) =>
          this.editEdgeCallback(edgeData, callback)
      },
    };

    var data = this.getData();

    var container = this.visNetwork.nativeElement;
    this.networkInstance = new Network(container, data, options);
    this.networkInstance.disableEditMode();
  }

  private updateNode(id: any): void {
    let node = this.networkInstance.body.data.nodes.get(id);
    let newId = this.nodeIdControl.value;
    let edgesCopy: any[] = [];
    let edges = this.networkInstance.getConnectedEdges(node.id);

    if (!this.canNodeBeEdited(id)) {
      this.showError = true;
      return;
    }

    this.showError = false;

    edges.forEach((e: any) => {
      let edge = this.networkInstance.body.data.edges.get(e);
      edgesCopy.push(edge);
    });

    this.networkInstance.body.data.edges.remove(edges);
    this.networkInstance.body.data.nodes.remove(node);

    node.id = newId;
    node.label = `[${this.nodeIdControl.value}] ${this.nodeControl.value}`;

    this.networkInstance.body.data.nodes.update(node);

    edgesCopy.forEach((edge) => {
      edge.from == id ? (edge.from = newId) : (edge.to = newId);
      if (edge.from != edge.to) {
        this.networkInstance.body.data.edges.update(edge);
      }
    });
  }

  private canNodeBeEdited(currentId: any) {
    let allNodes = this.networkInstance.body.data.nodes.get();
    for (let node of allNodes) {
      if (node.id == this.nodeIdControl.value && node.id != currentId) {
        return false;
      }
    }

    return true;
  }

  private addNodeCallback(nodeData: any, callback: any) {
    this.showEditNode = !this.showEditNode;
    nodeData.id = this.nodeIdControl.value;
    nodeData.label = `[${this.nodeIdControl.value}] ${this.nodeControl.value}`;
    this.nodeControl.reset();
    this.nodeIdControl.reset();
    callback(nodeData);
  }

  private addEdgeCallback(edgeData: any, callback: any) {
    this.showEditEdge = !this.showEditEdge;
    edgeData.label = this.edgeControl.value;
    callback(edgeData);
  }

  private editEdgeCallback(edgeData: any, callback: any) {
    this.showEditEdge = !this.showEditEdge;
    edgeData.label = this.edgeControl.value;
    this.edgeControl.reset();
    callback(edgeData);
  }

  private getData(): any {
    const nodes = new DataSet<any>([
      { id: 1, label: `[1] Node1` },
      { id: 2, label: '[2] Node2' },
      { id: 3, label: '[3] Node3' },
      { id: 4, label: '[4] Node4' },
      { id: 5, label: '[5] Node5' },
    ]);

    this.nodeCount = nodes.length;

    const edges = new DataSet<any>([
      { from: '4', to: '3' },
      { from: '1', to: '4' },
      { from: '2', to: '4' },
      { from: '2', to: '5' },
    ]);

    return { nodes, edges };
  }
}
