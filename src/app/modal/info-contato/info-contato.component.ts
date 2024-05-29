import { HttpClient } from "@angular/common/http";
import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { SafeUrl, DomSanitizer } from "@angular/platform-browser";
import { contato } from "src/app/models/contatos";

@Component({
  selector: 'app-info-contato',
  templateUrl: './info-contato.component.html',
  styleUrls: ['./info-contato.component.css']
})
export class InfoContatoComponent {

  public contato?: contato;
  public foto?: SafeUrl;

  constructor(
    public dialogRef: MatDialogRef<InfoContatoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: contato,
    private httpClient: HttpClient,
    private sanitizer: DomSanitizer // Adicione o DomSanitizer
  ) {
    this.contato = data;
    this.onFoto();
  }

  private onFoto() {
    this.httpClient.get(`/api/foto/download/${this.contato?.pessoa?.id}`, { responseType: 'blob' }).subscribe({
      next: (blob) => {
        // Converte o blob em uma URL segura
        this.foto = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob));
      },
      error: (err) => {
        alert("Erro ao carregar a foto.");
      },
    })
  }
}
