import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Subject, Subscription, debounceTime, takeUntil } from 'rxjs';
import { ProductService } from 'src/app/demo/service/product.service';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
    templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit, OnDestroy {

    items!: MenuItem[];

    products!: any[];

    chartData: any;

    chartOptions: any;

    subscription!: Subscription;

    stateCallNotifications = '';
    skeletonNotificationBodyRows = ['1', '2', '3'];
    skeletonNotificationsRows = ['1', '2'];
    notifications: any[] = [];
    notificationsToday = [];
    notificationsYesterday = [];
    notificationsDaysAgo = {};
    private destroy$ = new Subject<void>();

    messageError = 'Ha ocurrido un error al cargar las notificaciones. Por favor, inténtalo de nuevo más tarde.'

    constructor(private productService: ProductService, public layoutService: LayoutService, private service: AuthService) {
        this.subscription = this.layoutService.configUpdate$
            .pipe(debounceTime(25))
            .subscribe((config) => {
                this.initChart();
            });
    }

    ngOnInit() {
        this.callGetNotificationReport();
        this.initChart();
        this.productService.getProductsSmall().then(data => this.products = data);

        this.items = [
            { label: 'Add New', icon: 'pi pi-fw pi-plus' },
            { label: 'Remove', icon: 'pi pi-fw pi-minus' }
        ];
    }

    callGetNotificationReport() {
        this.stateCallNotifications = 'charging';
        this.service.getNotificationReport().pipe(takeUntil(this.destroy$)).subscribe(
            (res: any) => {
                this.notifications = [
                    ...res.data.comments.map(comment => ({ ...comment, type: 'comment', icon: this.getNotificationIcon(comment.comment || comment.status) })),
                    ...res.data.tasks.map(task => ({ ...task, type: 'task', icon: this.getNotificationIcon(task.task) })),
                    ...res.data.status.map(status => ({ ...status, type: 'status', icon: this.getNotificationIcon(status.status) })) // Añadir los status
                ];
                this.categorizeNotifications();
            },
            (error) => {
                this.stateCallNotifications = 'error';
            }
        );
    }

    refreshNotificactions() {
        this.notifications = [];
        this.notificationsToday = [];
        this.notificationsYesterday = [];
        this.notificationsDaysAgo = {};
        this.callGetNotificationReport();
    }

    categorizeNotifications() {
        const today = this.normalizeDate(new Date());

        this.notifications.forEach(notification => {
            let date = '';
            notification.created_at ? date = notification.created_at : date = notification.updated_at;
            const notificationDate = this.normalizeDate(this.parseDate(date));
            const diffDays = this.calculateDiffDays(notificationDate, today);

            if (diffDays === 0) {
                this.notificationsToday.push(notification);
            } else if (diffDays === 1) {
                this.notificationsYesterday.push(notification);
            } else {
                if (!this.notificationsDaysAgo[diffDays]) {
                    this.notificationsDaysAgo[diffDays] = [];
                }
                this.notificationsDaysAgo[diffDays].push(notification);
            }
        });
        this.stateCallNotifications = 'complete';
    }

    parseDate(dateString: string): Date {
        const parts = dateString.split(' ');
        const dateParts = parts[0].split('-');
        const timeParts = parts[1].split(':');

        return new Date(
            parseInt(dateParts[2], 10),  // Año
            parseInt(dateParts[1], 10) - 1,  // Mes (0-indexado)
            parseInt(dateParts[0], 10),  // Día
            parseInt(timeParts[0], 10),  // Horas
            parseInt(timeParts[1], 10),  // Minutos
            parseInt(timeParts[2], 10)   // Segundos
        );
    }

    calculateDiffDays(date1: Date, date2: Date): number {
        const oneDay = 24 * 60 * 60 * 1000; // Milisegundos en un día
        const diffTime = date2.getTime() - date1.getTime(); // Diferencia en milisegundos
        return Math.floor(diffTime / oneDay); // Convertimos a días completos
    }

    normalizeDate(date: Date): Date {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    }

    getNotificationIcon(text: string): string {
        console.log(text);
        if (text.includes("en la reunión")) {
            return "pi pi-fw pi-calendar-plus";
        } else if (text.includes("en el artículo")) {
            return "pi pi-fw pi-book";
        } else if (text.includes("en la sustentación")) {
            return "pi pi-fw pi-copy";
        } else if (text.includes("en la revisión de tesis")) {
            return "pi pi-fw pi-file-export";
        } else if (text.includes("en la asesoría")) {
            return "pi pi-fw pi-file-import";
        } else if (text.includes("en la inscripción")) {
            return "pi pi-fw pi-file";
        } else if (text.includes("actualización de estado")) {  // Nuevo ícono para status
            return "pi pi-fw pi-refresh";
        }
        // Ícono por defecto
        return "pi pi-comment";
    }


    initChart() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        this.chartData = {
            labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Set', 'Oct', 'Nov', 'Dic'],
            datasets: [
                {
                    label: 'En revision',
                    data: [65, 59, 80, 81, 56, 55, 40],
                    fill: false,
                    backgroundColor: documentStyle.getPropertyValue('--bluegray-700'),
                    borderColor: documentStyle.getPropertyValue('--bluegray-700'),
                    tension: .4
                },
                {
                    label: 'Aprobado',
                    data: [28, 48, 40, 19, 86, 27, 110],
                    fill: false,
                    backgroundColor: documentStyle.getPropertyValue('--green-600'),
                    borderColor: documentStyle.getPropertyValue('--green-600'),
                    tension: .4
                },
                {
                    label: 'Cancelado',
                    data: [0,0,0,0,0,0,1],
                    fill: false,
                    backgroundColor: documentStyle.getPropertyValue('--red-600'),
                    borderColor: documentStyle.getPropertyValue('--red-600'),
                    tension: .4
                }
            ]
        };

        this.chartOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                },
                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                }
            }
        };
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
        this.destroy$.next();
        this.destroy$.complete();
    }
}
