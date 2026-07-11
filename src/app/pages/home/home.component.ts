import { AfterViewInit, Component } from '@angular/core';
import { AnimationOptions } from 'ngx-lottie';
import { Industry } from 'src/app/models/industry.model';
import { ServiceCard } from 'src/app/models/service-card.model';
// import function to register Swiper custom elements
import { register } from 'swiper/element/bundle';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    standalone: false
})
export class HomeComponent implements AfterViewInit {
  options: AnimationOptions = {
    path: '/assets/animation/coding.json',
  };

  services: ServiceCard[] = [
    {
      title: 'DESIGN_ENGINEERING',
      description: 'DESIGN_ENGINEERING',
      coverImage: 'assets/img/design-engineering.webp',
    },
    {
      title: 'SOFTWARE_ENGINEERING',
      description: 'SOFTWARE_ENGINEERING',
      coverImage: 'assets/img/software-engineering.png',
    },
    {
      title: 'PROJECT_MANAGEMENT',
      description: 'PROJECT_MANAGEMENT',
      coverImage: 'assets/img/project-management.gif',
    },
    {
      title: 'MAINTENANCE_AND_GENERAL_WORK',
      description: 'MAINTENANCE_AND_GENERAL_WORK',
      coverImage: 'assets/img/maintenance-and-general-work.webp',
    },
  ];

  industries: Industry[] = [
    {
      name: 'FMCG',
    },
    {
      name: 'PET',
    },
    {
      name: 'MINING',
    },
    {
      name: 'OIL_AND_GAS',
    },
  ];

  ngAfterViewInit(): void {
    register();
  }
}
