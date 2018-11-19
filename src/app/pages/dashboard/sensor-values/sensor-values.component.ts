import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {MeasurementService} from '../../../services/measurement/measurement.service';
import {Device} from '../../../models/device.model';

@Component({
  selector: 'ngx-sensor-values',
  styleUrls: ['./sensor-values.component.scss'],
  template: `
    <div class="row" *ngIf="selectedDevice && lastMeasurementLoaded">
      <div *ngFor="let key of objectKeys(lastMeasurement.values)" class="col-md-4">
        <nb-card>
          <div>{{ key }}: {{lastMeasurement.values[key]}}</div>
        </nb-card>
      </div>
    </div>
  `,
})
export class SensorValuesComponent implements OnInit, OnChanges {
  @Input() selectedDevice: Device;
  objectKeys = Object.keys;
  public lastMeasurement: any;
  public lastMeasurementLoaded = false;
  private lastMeasurementSubscription: any;

  constructor(private measurementService: MeasurementService) {
  }

  private getLastMeasurementValue(id) {
    this.lastMeasurementSubscription = this.measurementService.getLastMeasurement(id)
      .subscribe(
        (lastMeasurement) => {
          this.lastMeasurement = lastMeasurement;
          console.log(lastMeasurement);
          this.lastMeasurementLoaded = true;
        });
  }

  ngOnChanges(changes: SimpleChanges) {
    for (const property in changes) {
      if (property === 'selectedDevice') {
        this.selectedDevice = changes[property].currentValue;
        this.getLastMeasurementValue(this.selectedDevice._id);
      }
    }
  }

  ngOnInit(): void {
    this.getLastMeasurementValue(this.selectedDevice._id);
  }
}
