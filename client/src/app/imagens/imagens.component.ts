import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ImagemService } from '../service/imagem.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../environments/environment';
import {
  DomSanitizer,
  SafeResourceUrl,
  SafeUrl,
} from '@angular/platform-browser';

@Component({
  selector: 'app-imagens',
  standalone: false,
  templateUrl: './imagens.component.html',
  styleUrl: './imagens.component.css',
})
export class ImagensComponent implements OnInit {
  @ViewChild('filesInput') filesInput!: ElementRef;

  multipleImages!: any[];
  imgs_anexo: any;
  imgUrl: SafeResourceUrl | null = null;
  lista_imagens!: any[];

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private imageService: ImagemService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.getImagens()
    // Initialization logic can go here
  }

  selectMultipleImage(event: any) {
    if (event.target.files.length > 0) {
      this.multipleImages = event.target.files;
    }
  }

  onFilesUpload() {
    const files = new FormData();

    for (let img of this.multipleImages) {
      files.append('files', img);
    }
    this.http.post(environment.apiUrl + 'cadastraimagens', files).subscribe({
      next: (res: any) => {
        this.toastr.success('Evento cadastrado com sucesso!');
      },
      error: (e) => this.toastr.error(e),
    });
  }

  getImagens() {
    this.imageService.verimagens().subscribe(
        (imagensData: any[]) => {
            if (imagensData && imagensData.length > 0) {
                this.lista_imagens = imagensData.map(imagem => {
                    const decodedImage = 'data:image/jpeg;base64,' + imagem.base64;
                    const safeImageUrl: SafeUrl = this.sanitizer.bypassSecurityTrustUrl(decodedImage);
                    return {
                        id: imagem.id,
                        mimetype: imagem.mimetype,
                        imagem: safeImageUrl
                    };
                });
                console.log('imagens', this.lista_imagens)
            } else {
                this.lista_imagens = [];
                console.warn('Nenhuma imagem encontrada');
                // Exibir mensagem ao usuário, por exemplo:
                // this.showMessage('Nenhuma imagem encontrada.');
            }
            console.log('imagens', this.lista_imagens)
        },

        (erro: any) => {
            console.error('Erro ao buscar imagens:', erro);
            // Exibir mensagem ao usuário, por exemplo:
            // this.showMessage('Erro ao buscar imagens. Tente novamente mais tarde.');
        }
    );
}
}
