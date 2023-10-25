<template>
    <div class="row justify-content-center">
        <div class="col-10 mt-4">
            <h2>Lista de Activos</h2>
            <div class="d-flex justify-content-end">
                <button type="button" class="btn btn-outline-success" data-bs-toggle="modal" data-bs-target="#activoModal"
                    @click="createActivo">Añadir</button>
                <div class="modal fade" id="activoModal" tabindex="-1" aria-labelledby="activoModalLabel"
                    aria-hidden="true">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h1 class="modal-title fs-5" id="activoModalLabel">{{ modo ? 'Añadir Área' :
                                    'Actualizar Área' }}</h1>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <form>
                                    <div class="row justify-content-center">
                                        <div class="col-10">
                                            <div class="form-group">
                                                <label for="tipo">Tipo de Activo</label>
                                                <input type="text" class="form-control" required maxlength="100" name="tipo"
                                                    id="tipo" v-model="form.tipo">
                                            </div>
                                            <div class="form-group mt-3">
                                                <label for="marca">Marca de Activo</label>
                                                <input type="text" class="form-control" required maxlength="150"
                                                    name="marca" id="marca" v-model="form.marca">
                                            </div>
                                            <div class="form-group mt-3">
                                                <label for="modelo">Modelo del Activo</label>
                                                <input type="text" class="form-control" maxlength="150" required
                                                    name="modelo" id="modelo" v-model="form.modelo">
                                            </div>
                                            <div class="form-group mt-3">
                                                <label for="estado">Estado del Activo</label>
                                                <select class="form-control" name="estado" id="estado" required
                                                    v-model="form.estado">
                                                    <option value="Nuevo">Nuevo</option>
                                                    <option value="Usado">Usado</option>
                                                    <option value="En desuso">En desuso</option>
                                                </select>
                                            </div>
                                            <div class="form-group mt-3">
                                                <label for="areaId">Área del Activo</label>
                                                <select class="form-control" name="areaId" id="areaId" required
                                                    v-model="form.areaId">
                                                    <option v-for="area in areas" :key="area.id" :value="area.id">{{
                                                        area.nombre }}</option>
                                                </select>
                                            </div>
                                            <div class="form-group mt-3 text-center">
                                                <button type="button" class="btn btn-outline-success"
                                                    data-bs-dismiss="modal" @click="modo ? storeActivo : updateActivo">{{
                                                        modo ? 'Añadir' :
                                                        'Actualizar' }}</button>
                                                &nbsp;&nbsp;
                                                <button type="button" class="btn btn-outline-danger"
                                                    data-bs-dismiss="modal">Cerrar</button>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="table-responsive mt-3">
                <table class="animate__animated animate__fadeInDown table table-hover table-sm caption-top">
                    <caption>
                        <div class="row">
                            <div class="col-3">
                                <input type="text" placeholder="Buscar por tipo..." class="form-control" name="search" id="search"
                                    @keyup="searchByTipo" v-model="filterByTipo">
                            </div>
                            <div class="col-3">
                                <select v-model="filterByEstado" class="form-control" @change="searchByEstado" placeholder="Buscar por estado...">
                                    <option value="">Buscar por estado...</option>
                                    <option value="Nuevo">Nuevo</option>
                                    <option value="Usado">Usado</option>
                                    <option value="En desuso">En desuso</option>
                                </select>
                            </div>
                        </div>
                    </caption>
                    <thead class="table-dark">
                        <tr>
                            <th class="text-center">ID</th>
                            <th>TIPO</th>
                            <th>MARCA</th>
                            <th>MODELO</th>
                            <th>ESTADO</th>
                            <th>ÁREA</th>
                            <th class="text-center">OPCIONES</th>
                        </tr>
                    </thead>
                    <tbody class="table-group-divider">
                        <tr v-for="activo in activos" :key="activo.id">
                            <td class="text-center">{{ activo.id }}</td>
                            <td>{{ activo.tipo }}</td>
                            <td>{{ activo.marca }}</td>
                            <td>{{ activo.modelo }}</td>
                            <td>{{ activo.estado }}</td>
                            <td>{{ activo.area.nombre }}</td>
                            <td class="text-center">
                                <button type="button" class="btn btn-outline-success" @click="editActivo(activo)"><i
                                        class="fa-solid fa-pen-to-square"></i></button>
                                &nbsp;
                                <button type="button" class="btn btn-outline-danger" @click="deleteActivo(activo.id)"><i
                                        class="fa-solid fa-trash"></i></button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2';
import * as bootstrap from 'bootstrap';
export default {
    data() {
        return {
            url: 'http://localhost:3000',
            activos: [],
            areas: [],
            modo: true,
            filterByEstado: '',
            form: {
                tipo: '',
                marca: '',
                modelo: '',
                estado: '',
                areaId: 0
            },
            idActivoSeleccionada: 0,
            filterByTipo: ''
        };
    },
    mounted() {
        this.all();
        this.allAreas();
    },
    methods: {
        message(icon, title) {
            const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer)
                    toast.addEventListener('mouseleave', Swal.resumeTimer)
                }
            });
            Toast.fire({ icon, title });
        },
        allAreas() {
            axios.get(this.url + '/areas?_sort=nombre&_order=asc')
                .then(response => {
                    this.areas = response.data;
                }).catch(error => {
                    this.message('error', 'Error al cargar las áreas.');
                    console.error(error);
                });
        },
        fetchData(params) {
            axios.get(`${this.url}/activos?_expand=area&_sort=id&_order=desc${params}`)
                .then(response => {
                    this.activos = response.data;
                })
                .catch(error => {
                    this.message('error', 'Error al cargar las activos.');
                    console.error(error);
                });
        },
        all() {
            this.fetchData('');
        },
        searchByTipo() {
            this.fetchData(`&tipo_like=${this.filterByTipo}`);
            this.filterByEstado = '';
        },
        searchByEstado() {
            if (this.filterByEstado == '') {
                this.fetchData('');
            } else {
                this.fetchData(`&estado=${this.filterByEstado}`);
                this.filterByTipo = '';
            }
        },
        createActivo() {
            this.modo = true;
            this.form = {
                tipo: '',
                marca: '',
                modelo: '',
                estado: '',
                areaId: 0
            };
        },
        storeActivo() {
            axios.post(this.url + '/activos', this.form)
                .then(response => {
                    if (response.status == 201) {
                        this.all();
                        this.message('success', 'Activo añadido satisfactoriamente.');
                    } else {
                        this.message('error', 'Error al añadir el activo.');
                    }
                })
                .catch(error => {
                    this.message('error', 'Error en el servidor.');
                    console.log(error);
                });
        },
        editActivo(activo) {
            this.modo = false;
            this.idActivoSeleccionada = activo.id;
            this.form = {
                tipo: activo.tipo,
                marca: activo.marca,
                modelo: activo.modelo,
                estado: activo.estado,
                areaId: activo.areaId,
            };
            const modal = new bootstrap.Modal(document.getElementById('activoModal'));
            modal.show();
        },
        updateActivo() {
            axios.put(this.url + '/activos/' + this.idActivoSeleccionada, this.form)
                .then(response => {
                    if (response.status == 200) {
                        this.all();
                        this.message('success', 'Activo actualizada satisfactoriamente.');
                    } else {
                        this.message('error', 'Error al actualizar el activo.');
                    }
                })
                .catch(error => {
                    this.message('error', 'Error en el servidor.');
                    console.log(error);
                });
        },
        deleteActivo(id) {
            Swal.fire({
                title: 'Activo',
                text: "¿ Está seguro que desea eliminar el activo ?",
                icon: 'error',
                showClass: {
                    popup: 'animate__animated animate__fadeInDown'
                },
                hideClass: {
                    popup: 'animate__animated animate__fadeOutUp'
                },
                showCancelButton: true,
                confirmButtonColor: '#00695c',
                cancelButtonColor: '#d33',
                cancelButtonText: 'Cancelar',
                confirmButtonText: 'Eliminar',
            }).then((result) => {
                if (result.isConfirmed) {
                    axios.delete(this.url + '/activos/' + id)
                        .then(response => {
                            if (response.status == 200) {
                                this.all();
                                this.message('success', 'Activo eliminada satisfactoriamente.');
                            } else {
                                this.message('error', 'Error al eliminar el activo.');
                            }
                        })
                        .catch(error => {
                            this.message('error', 'Error en el servidor.');
                            console.log(error);
                        });
                }
            });
        },
    }
}
</script>

<style></style>