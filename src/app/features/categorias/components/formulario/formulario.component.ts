import { Component, OnInit } from '@angular/core';
import { CategoriaService } from '../../service/categoria.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Categoria } from '../../models/categoria.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.scss']
})
export class FormularioComponent implements OnInit {

  categoria!: Categoria
  id: string = '';
  formCategoria!: FormGroup;
  route: string = '';
  isNewForm: boolean = false;

  constructor(private categoriaService: CategoriaService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder) { }
  
  ngOnInit(): void {
    this.route = this.activatedRoute.snapshot.url[0].path;
    this.criarFormulario();

    if (this.route === 'editar') {
      this.id = this.activatedRoute.snapshot.url[1].path;
      this.searchCategoryForId();
    } else {
      this.isNewForm = true;
    }
    
  }

  searchCategoryForId() {
    this.categoriaService.getCategoriasForId(parseInt(this.id))
    .subscribe((categoria: Categoria) => {
    this.categoria = categoria;
    this.formCategoria.controls['nome'].setValue(categoria.nome);
    this.formCategoria.controls['descricao'].setValue(categoria.descricao);
    })
  }

  criarFormulario() {
    this.formCategoria = this.formBuilder.group({
      nome: ['', Validators.required],
      descricao: ['', Validators.required]
    })
  }

  salvarCategoria(){
    if (this.formCategoria.touched && this.formCategoria.dirty) {
      const payload: Categoria = {
        nome: this.formCategoria.controls['nome'].value,
        descricao: this.formCategoria.controls['descricao'].value,
      }
      if(this.isNewForm) {
        this.createCategory(payload);
      } else {
        payload.id = this.categoria.id;
        this.editCategory(payload);
      }
    }
  }

  editCategory(payload: Categoria) {
    this.categoriaService.editCategory(payload)
      .subscribe((response) => {
        this.router.navigate(['categorias']);
      })
  }

  createCategory(payload: Categoria) {
    this.categoriaService.createCategory(payload)
      .subscribe((response) => {
        this.router.navigate(['categorias']);
      })
  }
}
