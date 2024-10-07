import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { ThesisSimilarityService } from 'src/app/services/thesis-similarity.service';

@Component({
  selector: 'app-similarity-titles',
  templateUrl: './similarity-titles.component.html',
  styleUrls: ['./similarity-titles.component.scss'],
  providers: [ThesisSimilarityService]
})
export class SimilarityTitlesComponent implements OnInit {
  titlesList = [];
  status = '';
  minimumPercentage: number = 60;
  lastMinimumPercentage: number = 60;
  configCompareTitle: boolean = false;
  results: Array<{ title: string, similarity: number }> = [];
  _title: FormControl = new FormControl('', [Validators.required]);
  get title() {
    return this._title;
  }
  titleForm: FormGroup;
  constructor(private fb: FormBuilder, private service: AuthService,
    private thesisSimilarity: ThesisSimilarityService
  ) {
    this.titleForm = this.fb.group({
      title: this.title
    })
  }

  ngOnInit() {
    this.callGetTitles();
    this.watchTitle();
  }

  watchTitle(): void {
    this.title.valueChanges.pipe().
      subscribe((value: string) => {
        this.results = this.thesisSimilarity.compareWithThesisTitles(value, this.titlesList, this.minimumPercentage)
          .sort((a, b) => b.similarity - a.similarity);
        console.log('this.results', this.results)
      })
  }

  callGetTitles() {
    this.status = 'charging';
    this.service.getTitlesList().pipe().
      subscribe(
        (res: any) => {
          if (res.data) {
            this.status = 'complete';
            this.titlesList = res.data;
          }
        }, (error) => {
          this.status = 'error';
        })
  }

  showConfigCompareTitle() {
    this.lastMinimumPercentage = this.minimumPercentage;
    this.configCompareTitle = true;
  }

  cancelConfigCompareTitle() {
    this.minimumPercentage = this.lastMinimumPercentage;
    this.configCompareTitle = false;
  }

  saveConfigCompareTitle() {
    this.results = this.thesisSimilarity.compareWithThesisTitles(this.title.value, this.titlesList, this.minimumPercentage)
      .sort((a, b) => b.similarity - a.similarity);
    this.configCompareTitle = false;
  }

  getSimilarityClass(similarity: number): string {
    if (similarity >= 75) {
      return 'bg-orange-500'; // Color verde para alta similitud
    } else if (similarity >= 50) {
      return 'bg-yellow-500'; // Color amarillo para similitud media
    } else {
      return 'bg-green-500'; // Color naranja para baja similitud
    }
  }
  getSimilarityClassText(similarity: number): string {
    if (similarity >= 75) {
      return 'text-orange-500'; // Color verde para alta similitud
    } else if (similarity >= 50) {
      return 'text-yellow-500'; // Color amarillo para similitud media
    } else {
      return 'text-green-500'; // Color naranja para baja similitud
    }
  }

}
