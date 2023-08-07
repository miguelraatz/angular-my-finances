import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpBaseService } from 'src/app/shared/base/http-base.service';
import { Categoria } from '../models/categoria.model';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService extends HttpBaseService{

  private endPoint = 'categorias'

  constructor(protected override readonly injector: Injector) {
    super(injector)
  }

  getCategorias(): Observable<any> {
    return this.httpGet(this.endPoint)
  }

  getCategoriasForId(id: number): Observable<any> {
    return this.httpGet(`${this.endPoint}/${id}`)
  }

  editCategory(payload: Categoria): Observable<any> {
    return this.httpPut(`${this.endPoint}/${payload.id}`, payload)
  }

  deleteCategory(id: number): Observable<any> {
    return this.httpDelete(`${this.endPoint}/${id}`);
  }

  createCategory(payload: Categoria): Observable<any> {
    return this.httpPost(`${this.endPoint}`, payload)
  }
}
