import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

import { LayersService } from '../../services/layers.service';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: [
    './map.component.scss'
  ]
})
export class MapComponent implements OnInit {
  @Output() floodAreas: object;
  @Output() map: mapboxgl.Map;
  @Output() finishedLoading = new EventEmitter();

  constructor(
    private layersService: LayersService,
    private httpService: HttpService
  ) { }

  ngOnInit() {
    const self = this;
    mapboxgl.accessToken = 'pk.eyJ1IjoidXJiYW5yaXNrbWFwIiwiYSI6ImNpdmVhc2VwZTAwNmYydXFrOThrMWxmcGIifQ.Dl07iYeyvtqJxOVXa9_A0A';
    self.map = new mapboxgl.Map({
      attributionControl: false,
      container: 'mapContainer',
      center: [106.84, -6.15],
      zoom: 11,
      minZoom: 10,
      style: 'mapbox://styles/urbanriskmap/cjcs5ffxd08kg2qoit2v6uilo',
      hash: false,
      preserveDrawingBuffer: true
    });
    // Add zoom and rotation controls to the map.
    self.map.addControl(new mapboxgl.NavigationControl(), 'top-right');


    self.map.on('style.load', () => {
      // Load neighborhood polygons
      self.httpService.getFloodAreas('jbd')
      .then(geojsonData => {
        self.floodAreas = geojsonData;
        self.layersService.loadFloodAreas(self.floodAreas, self.map)
        .then(() => {
          self.finishedLoading.emit();
        });
      })
      .catch(error => {
        throw JSON.stringify(error);
      });
    });
  }
}
