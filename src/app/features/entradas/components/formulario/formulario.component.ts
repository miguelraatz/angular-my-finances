import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Categoria } from 'src/app/features/categorias/models/categoria.model';
import { CategoriaService } from 'src/app/features/categorias/service/categoria.service';
import { EntradasService } from '../../service/entradas.service';
import * as dayjs from 'dayjs'
import { Entrada } from '../../models/entrada.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.scss']
})
export class FormularioComponent implements OnInit{
    tiposDeEntradas = [
    'receita',
    'despesa'
  ];

  statusDePagamento = [
   {value: true, descricao: 'Pago'},
   {value: false, descricao: 'Pendente'}
  ];

  categorias: Categoria[] = [];
  formEntradas!: FormGroup;
  rota: string = '';
  id: string = '';
  entrada!: Entrada;
  isCreate: boolean = false;

  categorias$ = this.categoriaService.getCategorias();

  constructor(private readonly categoriaService: CategoriaService,
    private formBuilder: FormBuilder,
    private readonly entradaService: EntradasService,
    private router: Router,
    private activatedRouter: ActivatedRoute) {

  }

  ngOnInit(): void {
    this.createForm();
    this.rota = this.activatedRouter.snapshot.url[0].path;

    if(this.rota === 'editar') {
      this.id = this.activatedRouter.snapshot.url[1].path;
      this.searchEntryForId();
    } else {
      this.isCreate = true;
    }
  }

  searchEntryForId() {
    this.entradaService.getEntradasForId(+this.id)
    .subscribe((entrada: Entrada) => {
      this.entrada = entrada;

      const data = this.entrada.data.split('-')

      this.formEntradas.controls['nome'].setValue(this.entrada.nome);
      this.formEntradas.controls['valor'].setValue(this.entrada.valor);
      this.formEntradas.controls['categoriaId'].setValue(this.entrada.categoriaId);
      this.formEntradas.controls['pago'].setValue(this.entrada.pago);
      this.formEntradas.controls['tipo'].setValue(this.entrada.tipo);
      this.formEntradas.controls['data'].setValue(new Date(+data[2], +data[1], +data[0]));
    });
  }

  saveEntry() {
    const data = dayjs(this.formEntradas.controls['data'].value)
    .format('DD/MM/YYYY');

    const payloadRequest: Entrada = Object.assign('', this.formEntradas.getRawValue());

    payloadRequest.data = data;

    const payload: Entrada = {
      nome: payloadRequest.nome,
      categoriaId: payloadRequest.categoriaId,
      data: payloadRequest.data,
      pago: payloadRequest.pago,
      tipo: payloadRequest.tipo,
      valor: payloadRequest.valor,
    }

    if (this.isCreate) {
      this.createNewEntry(payload);
    } else {
      payload.id = this.entrada.id;
      this.editEntry(payload)
    }
    
  }

  createNewEntry(payload: Entrada) {
    this.entradaService.createEntry(payload)
    .subscribe(response => {
      this.redirect();
    })
  }

  editEntry(payload: Entrada) {
    this.entradaService.editEntry(payload)
    .subscribe(response => {
      this.redirect();
    })
  }

  redirect() {
    this.router.navigate(['entradas']);
  }

  createForm() {
    this.formEntradas = this.formBuilder.group({
      nome: ['', Validators.required],
      valor: ['', Validators.required],
      categoriaId: ['', Validators.required],
      pago: [true, Validators.required],
      tipo: ['Despesa', Validators.required],
      data: [new Date(), Validators.required],
    });
  }
}
