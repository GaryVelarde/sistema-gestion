import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Subject, Subscription, debounceTime, takeUntil } from 'rxjs';
import { classByStatusReport } from 'src/app/commons/constants/app.constants';
import { ProductService } from 'src/app/demo/service/product.service';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
    templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit, OnDestroy {

    items!: MenuItem[];

    products!: any[];

    chartDataInscription: any;
    chartDataAdvisory: any;
    chartDataReview: any;
    chartDataPresentation: any;
    labels = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Set', 'Oct', 'Nov', 'Dic'];
    chartOptions: any;

    statusChartInscription = '';
    statusChartAdvisory = '';
    statusChartReview = '';
    statusChartPresentation = '';
    statusChartArticles = '';

    subscription!: Subscription;

    stateCallNotifications = '';
    skeletonNotificationBodyRows = ['1', '2', '3'];
    skeletonNotificationsRows = ['1', '2'];
    notifications: any[] = [];
    notificationsToday = [];
    notificationsYesterday = [];
    notificationsDaysAgo = {};

    dataArticles: any;

    optionsArticles: any;

    years = [
        { name: '2024', code: '2024' },
        { name: '2023', code: '2023' },
        { name: '2022', code: '2022' },
        { name: '2021', code: '2021' },
        { name: '2020', code: '2020' },
        { name: '2019', code: '2019' },
        { name: '2018', code: '2018' },
        { name: '2017', code: '2017' },
        { name: '2016', code: '2016' },
        { name: '2015', code: '2015' },
        { name: '2014', code: '2014' },
        { name: '2013', code: '2013' },
        { name: '2012', code: '2012' },
        { name: '2011', code: '2011' },
        { name: '2010', code: '2010' }
    ];
    yearSelectedByInscription: any = { name: '2024', code: '2024' };
    yearSelectedByAdvisory: any = { name: '2024', code: '2024' };
    yearSelectedByReview: any = { name: '2024', code: '2024' };
    yearSelectedByPresentation: any = { name: '2024', code: '2024' };
    yearSelectedByArticles: any = { name: '2024', code: '2024' };

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
        this.callGetReportByArticles();
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

        this.fillChartInscription();

        this.fillChartAdvisory();

        this.fillChartReview();

        this.fillChartPresentation();

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

    fillChartInscription() {
        this.statusChartInscription = 'charging'
        const documentStyle = getComputedStyle(document.documentElement);
        this.service.getInscriptionMonthlyReport(this.yearSelectedByInscription.code).
            pipe(takeUntil(this.destroy$)).
            subscribe(
                (res: any) => {
                    let datasets = [];
                    let count = 1;
                    for (let data of res.data) {
                        console.log(data)
                        const obj = {
                            label: data.status,
                            data: data.total_month,
                            fill: false,
                            backgroundColor: documentStyle.getPropertyValue(classByStatusReport[count.toString()].class),
                            borderColor: documentStyle.getPropertyValue(classByStatusReport[count.toString()].class),
                            tension: .4
                        }
                        datasets.push(obj);
                        count++;
                    }
                    this.chartDataInscription = {
                        labels: this.labels,
                        datasets: datasets
                    };
                    this.statusChartInscription = 'complete'
                }, (error) => {
                    this.statusChartInscription = 'error'
                })
    }

    fillChartAdvisory() {
        this.statusChartAdvisory = 'charging';
        const documentStyle = getComputedStyle(document.documentElement);
        this.service.getAdvisoryMonthlyReport(this.yearSelectedByAdvisory.code).pipe(takeUntil(this.destroy$)).
            subscribe(
                (res: any) => {
                    let datasets = [];
                    let count = 1;
                    for (let data of res.data) {
                        const obj = {
                            label: data.status,
                            data: data.total_month,
                            fill: false,
                            backgroundColor: documentStyle.getPropertyValue(classByStatusReport[count.toString()].class),
                            borderColor: documentStyle.getPropertyValue(classByStatusReport[count.toString()].class),
                            tension: .4
                        }
                        datasets.push(obj);
                        count++;
                    }

                    this.chartDataAdvisory = {
                        labels: this.labels,
                        datasets: datasets
                    };
                    this.statusChartAdvisory = 'complete';
                }, (error) => {
                    this.statusChartAdvisory = 'error';
                })
    }

    fillChartReview() {
        this.statusChartReview = 'charging';
        const documentStyle = getComputedStyle(document.documentElement);
        this.service.getReviewsMonthlyReport(this.yearSelectedByReview.code).pipe(takeUntil(this.destroy$)).
            subscribe(
                (res: any) => {
                    let datasets = [];
                    let count = 1;
                    for (let data of res.data) {
                        const obj = {
                            label: data.status,
                            data: data.total_month,
                            fill: false,
                            backgroundColor: documentStyle.getPropertyValue(classByStatusReport[count.toString()].class),
                            borderColor: documentStyle.getPropertyValue(classByStatusReport[count.toString()].class),
                            tension: .4
                        }
                        datasets.push(obj);
                        count++;
                    }
                    this.chartDataReview = {
                        labels: this.labels,
                        datasets: datasets
                    };
                    this.statusChartReview = 'complete';
                }, (error) => {
                    this.statusChartReview = 'error';
                })
    }

    fillChartPresentation() {
        this.statusChartPresentation = 'charging';
        const documentStyle = getComputedStyle(document.documentElement);
        this.service.getPresentationMonthlyReport(this.yearSelectedByPresentation.code).pipe(takeUntil(this.destroy$)).
            subscribe(
                (res: any) => {
                    let datasets = [];
                    let count = 1;
                    for (let data of res.data) {
                        const obj = {
                            label: data.status,
                            data: data.total_month,
                            fill: false,
                            backgroundColor: documentStyle.getPropertyValue(classByStatusReport[count.toString()].class),
                            borderColor: documentStyle.getPropertyValue(classByStatusReport[count.toString()].class),
                            tension: .4
                        }
                        datasets.push(obj);
                        count++;
                    }
                    this.chartDataPresentation = {
                        labels: this.labels,
                        datasets: datasets
                    };
                    this.statusChartPresentation = 'complete';
                }, (error) => {
                    this.statusChartPresentation = 'error';
                })
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
        this.destroy$.next();
        this.destroy$.complete();
    }

    callGetReportByArticles() {
        this.statusChartArticles = 'charging';
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        this.service.getArticlesMonthlyReport(this.yearSelectedByArticles.code).pipe(takeUntil(this.destroy$)).
            subscribe((res: any) => {
                console.log(res)

                if (res.data) {
                    this.statusChartArticles = 'complete';
                    this.dataArticles = {
                        labels: res.data.status,
                        datasets: [
                            {
                                data: res.data.total,
                                backgroundColor: [
                                    documentStyle.getPropertyValue('--blue-500'),
                                    documentStyle.getPropertyValue('--yellow-500'),
                                    documentStyle.getPropertyValue('--green-500'),
                                    documentStyle.getPropertyValue('--orange-500'),
                                    documentStyle.getPropertyValue('--pink-500'),
                                ],
                                hoverBackgroundColor: [
                                    documentStyle.getPropertyValue('--blue-400'),
                                    documentStyle.getPropertyValue('--yellow-400'),
                                    documentStyle.getPropertyValue('--green-400'),
                                    documentStyle.getPropertyValue('--orange-500'),
                                    documentStyle.getPropertyValue('--pink-500'),
                                ]
                            }
                        ]
                    };

                    this.optionsArticles = {
                        plugins: {
                            legend: {
                                labels: {
                                    usePointStyle: true,
                                    color: textColor
                                }
                            }
                        }
                    };
                }



            }, (error) => {
                this.statusChartArticles = 'error';

            })
    }
}
