import { AfterViewInit, Component, ViewEncapsulation } from '@angular/core';
import { geoJson, Map, tileLayer } from 'leaflet';
import { MapService } from '../map-app/services/map.service';

@Component({
  selector: 'map-page',
  templateUrl: './map-page.component.html',
  styleUrls: ['./map-page.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MapComponent implements AfterViewInit {
  dataFromMap: any;

  constructor(private _mapService: MapService) {}

  ngAfterViewInit(): void {
    this._mapService.getMapData().subscribe((res: any) => {
      this.dataFromMap = res;
    });
    this.initMap();
  }

  initMap(): void {
    const map = new Map('map').setView(
      [51.16938212742927, 71.42737154630701],
      4
    );
    tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(map);

    geoJson(this.dataFromMap, {
      style: function (feature) {
        let color: string =
          feature?.properties.density > 1000
            ? '#800026'
            : feature?.properties.density > 500
            ? '#BD0026'
            : feature?.properties.density > 200
            ? '#E31A1C'
            : feature?.properties.density > 100
            ? '#FC4E2A'
            : feature?.properties.density > 50
            ? '#FD8D3C'
            : feature?.properties.density > 20
            ? '#FEB24C'
            : feature?.properties.density > 10
            ? '#FED976'
            : '#FFEDA0';
        return {
          color: 'black',
          weight: 2,
          fillColor: color,
          fillOpacity: 0.4,
          opacity: 1,
          dashArray: '3',
        };
      },
      onEachFeature: function (feature, layer) {
        layer.bindPopup(
          '<div>' +
            '<strong>Location: ' + feature.properties.shapeName + '</strong>' +
            '<img src="' + feature.properties.image + '" alt="' + feature.properties.personName + '" style="width: 90px; height: 90px; margin: 10px 0;"/>' +
            '<strong>Person: ' + feature.properties.personName + '</strong>' +
            '<strong>Information about person:</strong> ' + '<p>' + feature.properties.textInfo + '</p>'+
          '</div>'
        );
        
        
      },
    }).addTo(map);
  }
}
