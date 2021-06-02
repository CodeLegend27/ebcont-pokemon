import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './components/list/list.component';
import { ViewComponent } from './components/view/view.component';


const routes: Routes = [
  { path: '', component: ListComponent },
  { path: 'view/:name', component: ViewComponent },
  /* Wildcard Route in case the requested URL dosent match any paths or defined routes */
  { path: '**', component: ListComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'top'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
