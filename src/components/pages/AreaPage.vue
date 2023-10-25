<template>
    <div class="row justify-content-center">
        <div class="col-10 mt-4">
            <h2>Lista de Áreas</h2>
            <div class="d-flex justify-content-end">
                <button type="button" class="btn btn-outline-success" data-bs-toggle="modal" data-bs-target="#areaModal"
                    @click="createArea">Añadir</button>
                <div class="modal fade" id="areaModal" tabindex="-1" aria-labelledby="areaModalLabel" aria-hidden="true">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h1 class="modal-title fs-5" id="areaModalLabel">{{ modo ? 'Añadir Área' : 'Actualizar Área'
                                }}</h1>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <form>
                                    <div class="row justify-content-center">
                                        <div class="col-10">
                                            <div class="form-group">
                                                <label for="nombre">Nombre del Área</label>
                                                <input type="text" class="form-control" required maxlength="100"
                                                    name="nombre" id="nombre" v-model="form.nombre">
                                            </div>
                                            <div class="form-group mt-3">
                                                <label for="encargado">Encargado del Área</label>
                                                <input type="text" class="form-control" required maxlength="150"
                                                    name="encargado" id="encargado" v-model="form.encargado">
                                            </div>
                                            <div class="form-group mt-3">
                                                <label for="funcionarios">Número de funcionarios del Área</label>
                                                <input type="number" class="form-control" min="1" max="9999" required
                                                    name="funcionarios" id="funcionarios" v-model="form.funcionarios">
                                            </div>
                                            <div class="form-group mt-3 text-center">
                                                <button type="button" class="btn btn-outline-success"
                                                    data-bs-dismiss="modal" @click="modo ? storeArea : updateArea">{{
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
                    <caption><input type="text" placeholder="Buscar por área..." name="search" id="search"
                            @keyup="searchByArea" v-model="filterByArea"></caption>
                    <thead class="table-dark">
                        <tr>
                            <th class="text-center">ID</th>
                            <th>NOMBRE DEL ÁREA</th>
                            <th>ENCARGADO</th>
                            <th class="text-center">NÚMERO DE FUNCIONARIOS</th>
                            <th class="text-center">OPCIONES</th>
                        </tr>
                    </thead>
                    <tbody class="table-group-divider">
                        <tr v-for="area in areas" :key="area.id">
                            <td class="text-center">{{ area.id }}</td>
                            <td>{{ area.nombre }}</td>
                            <td>{{ area.encargado }}</td>
                            <td class="text-center">{{ area.funcionarios }}</td>
                            <td class="text-center">
                                <button type="button" class="btn btn-outline-success" @click="editArea(area)"><i
                                        class="fa-solid fa-pen-to-square"></i></button>
                                &nbsp;
                                <button type="button" class="btn btn-outline-danger" @click="deleteArea(area.id)"><i
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
            url: 'http://localhost:3000/areas',
            areas: [],
            modo: true,
            form: {
                nombre: '',
                encargado: '',
                funcionarios: 0
            },
            idAreaSeleccionada: 0,
            filterByArea: ''
        };
    },
    mounted() {
        this.all();
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
        fetchData(params) {
            axios.get(`${this.url}?_sort=id&_order=desc${params}`)
                .then(response => {
                    this.areas = response.data;
                })
                .catch(error => {
                    this.message('error', 'Error al cargar las áreas.');
                    console.error(error);
                });
        },
        all() {
            this.fetchData('');
        },
        searchByArea() {
            this.fetchData(`&nombre_like=${this.filterByArea}`);
        },
        createArea() {
            this.modo = true;
            this.form = {
                nombre: '',
                encargado: '',
                funcionarios: 0,
            };
        },
        storeArea() {
            axios.post(this.url, this.form)
                .then(response => {
                    if (response.status == 201) {
                        this.all();
                        this.message('success', 'Área añadida satisfactoriamente.');
                    } else {
                        this.message('error', 'Error al añadir el área.');
                    }
                })
                .catch(error => {
                    this.message('error', 'Error en el servidor.');
                    console.log(error);
                });
        },
        editArea(area) {
            this.modo = false;
            this.idAreaSeleccionada = area.id;
            this.form = {
                nombre: area.nombre,
                encargado: area.encargado,
                funcionarios: area.funcionarios,
            };
            const modal = new bootstrap.Modal(document.getElementById('areaModal'));
            modal.show();
        },
        updateArea() {
            axios.put(this.url + '/' + this.idAreaSeleccionada, this.form)
                .then(response => {
                    if (response.status == 200) {
                        this.all();
                        this.message('success', 'Área actualizada satisfactoriamente.');
                    } else {
                        this.message('error', 'Error al actualizar el área.');
                    }
                })
                .catch(error => {
                    this.message('error', 'Error en el servidor.');
                    console.log(error);
                });
        },
        deleteArea(id) {
            Swal.fire({
                title: 'Área',
                text: "¿ Está seguro que desea eliminar el área ?",
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
                    axios.delete(this.url + '/' + id)
                        .then(response => {
                            if (response.status == 200) {
                                this.all();
                                this.message('success', 'Área eliminada satisfactoriamente.');
                            } else {
                                this.message('error', 'Error al eliminar el área.');
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