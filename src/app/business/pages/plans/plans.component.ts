import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { ProductService } from 'src/app/demo/service/product.service';
import { LoaderService } from 'src/app/layout/service/loader.service';

@Component({
    templateUrl: './plans.component.html',
    styleUrls: ['./plans.component.scss'],
    providers: [MessageService, ProductService],
})
export class PlansComponent implements OnInit {
    actividadForm: FormGroup;
    previewData: any[] = [];
    rowspanData: any;
    breadcrumbItems: MenuItem[] = [
        { icon: 'pi pi-home', route: '/pages' },
        { label: 'Programa 3' },
        { label: 'Planes', visible: true },
    ];
    products: any[] | undefined;

    responsiveOptions: any[] | undefined;

    data: [
        {
            id: "9d252f67-641c-4dd3-aa49-2586ae74e74f",
            title: "Programa 2024",
            created_at: "01-10-2024 19:52:26",
            activities: [
                {
                    id: "9d252f67-6c31-4e70-8849-5d5e34a33c57",
                    description_activity: "Actividad 1",
                    tasks: [
                        {
                            "id": "9d252f67-6d94-47ce-93bb-73d5ebc5ee4d",
                            "description_task": "Tarea 1",
                            "months": "true,false,false,false,false,false,false,true,false,false,false,false",
                            "comment": null
                        },
                        {
                            "id": "9d252f67-6e7d-4e5e-8fd1-15374778cadb",
                            "description_task": "Tarea 2",
                            "months": "true,false,false,false,false,false,false,true,false,false,false,false",
                            "comment": "Comentario de prueba"
                        }
                    ]
                },
                {
                    "id": "9d252f67-6f8d-4eb0-bb21-2845bd76d51c",
                    "description_activity": "Actividad 2",
                    "tasks": [
                        {
                            "id": "9d252f67-710c-43f7-875e-303fb816ff23",
                            "description_task": "Tarea 2222",
                            "months": "true,false,false,false,false,false,false,true,false,false,false,false",
                            "comment": null
                        }
                    ]
                }
            ]
        }
    ]

    constructor(
        private router: Router,
        private fb: FormBuilder,
        private productService: ProductService
    ) {
        this.actividadForm = this.fb.group({
            tituloGeneral: ['', Validators.required], // Título general del formulario
            actividades: this.fb.array([]) // Un array para múltiples actividades
        });

    }

    ngOnInit() {
        this.productService.getProductsSmall().then((products) => {
            this.products = products;
        });

        this.responsiveOptions = [
            {
                breakpoint: '1199px',
                numVisible: 1,
                numScroll: 1
            },
            {
                breakpoint: '991px',
                numVisible: 2,
                numScroll: 1
            },
            {
                breakpoint: '767px',
                numVisible: 1,
                numScroll: 1
            }
        ];
    }

    getSeverity(status: string) {
        return 'success';
    }

    goToPlaneRegister() {
        this.router.navigate(['/pages/registro-planes'])
    }
}