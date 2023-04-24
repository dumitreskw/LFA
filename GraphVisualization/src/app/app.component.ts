import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';

import { DataSet } from 'vis-data/peer';
import { Network } from 'vis-network';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  @ViewChild('visNetwork', { static: false }) visNetwork!: ElementRef;
  showEditNode: boolean = false;
  showEditEdge: boolean = false;
  showSaveButton: boolean = false;

  nodeCount!: number;
  edgeControl = new FormControl('');
  nodeControl = new FormControl('');
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
    this.networkInstance.editNodeMode();
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
        editNode: (nodeData: any, callback: any) =>
          this.editNodeCallback(nodeData, callback),
        addEdge: (edgeData: any, callback: any) =>
          this.addEdgeCallback(edgeData, callback),
        editEdge: (edgeData: any, callback: any) =>
          this.editEdgeCallback(edgeData, callback),
      },
    };

    var data = this.getData();

    var container = this.visNetwork.nativeElement;
    this.networkInstance = new Network(container, data, options);
    this.networkInstance.disableEditMode();
  }

  private addNodeCallback(nodeData: any, callback: any) {
    this.showEditNode = !this.showEditNode;
    nodeData.label = this.nodeControl.value;
    nodeData.id = ++this.nodeCount;
    callback(nodeData);
  }

  private editNodeCallback(nodeData: any, callback: any) {
    this.showEditNode = !this.showEditNode;
    nodeData.label = this.nodeControl.value;
    this.nodeControl.reset();
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
      { id: 1, label: 'Node 1' },
      { id: 2, label: 'Node 2' },
      { id: 3, label: 'Node 3' },
      { id: 4, label: 'Node 4' },
      { id: 5, label: 'Node 5' },
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
