//import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';

import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';
import Container from '@mui/material/Container'
import Button from '@mui/material/Button'
import Modal from '@mui/material/Modal'
import TextField from '@mui/material/TextField'
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const URL = 'http://localhost:5000/libros/'

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.common.black,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));


function App() {

  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [modalInsertar, setModalInsertar] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);

  const [inputText, setInputText] = useState("");

  const [libroSeleccionado, setLibroSeleccionado] = useState({
    tittle: '',
    Genero: '',
    dateOf: '',
    numpages: 0,
    sinopsis: ''
  })

  let inputHandler = (e) => {
    var lowerCase = e.target.value.toLowerCase();
    setInputText(lowerCase);
    setPage(0);
  };

  const abrirCerrarModalInsertar = () => {
    setModalInsertar(!modalInsertar);
  }

  const abrirCerrarModalEditar = () => {
    setModalEditar(!modalEditar);
  }

  const abrirCerrarModalEliminar = () => {
    setModalEliminar(!modalEliminar);
  }

  const seleccionarLibro = (libro, caso) => {
    setLibroSeleccionado(libro);
    (caso === 'Editar') ? abrirCerrarModalEditar() : abrirCerrarModalEliminar();
  }
  const handleChange = e => {
    const { name, value } = e.target;
    setLibroSeleccionado(prevState => ({
      ...prevState,
      [name]: value
    }))
    console.log(libroSeleccionado);
  }

  const listarGet = async () => {
    await axios.get(URL)
      .then(response => {   
          setData(response.data.content);
      })
  }

  const agregarPost = async () => {
    await axios.post(URL, libroSeleccionado)
      .then(response => {
        setData(data.concat(response.data.content))
        abrirCerrarModalInsertar()
      })
  }

  const editarPut = async () => {
    console.log(libroSeleccionado._id);
    await axios.put(URL + libroSeleccionado._id, libroSeleccionado)
      .then(response => {
        var dataNueva = data;
        dataNueva.map(libro => {
          if (libroSeleccionado._id === libro._id) {
            libro.tittle = libroSeleccionado.tittle;
            libro.Genero = libroSeleccionado.Genero;
            libro.dateOf = libroSeleccionado.dateOf;
            libro.numpages = libroSeleccionado.numpages;
            libro.sinopsis = libroSeleccionado.sinopsis;
          }
        })
        setData(dataNueva);
        abrirCerrarModalEditar();
      })
  }

  const borrarDelete = async () => {
    await axios.delete(URL + libroSeleccionado._id)
      .then(response => {
        setData(data.filter(libro => libro._id !== libroSeleccionado._id));
        abrirCerrarModalEliminar();
      })
  }

  useEffect(() => {
    listarGet();
  })

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const bodyInsertar = (
    <Container component={Paper} maxWidth="sm">
      <h3>Agregar Nuevo Libro</h3>
      <Container align="center" maxWidth="lg">
        <TextField name="tittle" label="Titulo" onChange={handleChange} sx={{ width: 75 / 100 }} />
        <br /><br />
        <TextField name="Genero" label="Genero" onChange={handleChange} sx={{ width: 75 / 100 }} />
        <br /><br />
        <TextField name="dateOf" label="Fecha de Publicacion" onChange={handleChange} sx={{ width: 75 / 100 }} />
        <br /><br />
        <TextField name="numpages" label="Paginas" onChange={handleChange} sx={{ width: 75 / 100 }} />
        <br /><br />
        <TextField name="sinopsis" label="Sinopsis" onChange={handleChange} sx={{ width: 75 / 100 }} />
      </Container>
      <br /><br />
      <div align="right">
        <Button color="primary" onClick={() => agregarPost()}>Insertar</Button>
        <Button onClick={() => abrirCerrarModalInsertar()}>Cancelar</Button>
      </div>
    </Container>
  )

  const bodyEditar = (
    <Container component={Paper} maxWidth="sm">
      <h3>Agregar Nuevo Libro</h3>
      <Container align="center" maxWidth="lg">
        <TextField name="tittle" label="Titulo" onChange={handleChange} sx={{ width: 75 / 100 }} value={libroSeleccionado && libroSeleccionado.tittle} />
        <br /><br />
        <TextField name="Genero" label="Genero" onChange={handleChange} sx={{ width: 75 / 100 }} value={libroSeleccionado && libroSeleccionado.Genero} />
        <br /><br />
        <TextField name="dateOf" label="Fecha de Publicacion" onChange={handleChange} sx={{ width: 75 / 100 }} value={libroSeleccionado && libroSeleccionado.dateOf} />
        <br /><br />
        <TextField name="numpages" label="Paginas" onChange={handleChange} sx={{ width: 75 / 100 }} value={libroSeleccionado && libroSeleccionado.numpages} />
        <br /><br />
        <TextField name="sinopsis" label="Sinopsis" onChange={handleChange} sx={{ width: 75 / 100 }} value={libroSeleccionado && libroSeleccionado.sinopsis} />
      </Container>
      <br /><br />
      <div align="right">
        <Button color="primary" onClick={() => editarPut()}>Editar</Button>
        <Button onClick={() => abrirCerrarModalEditar()}>Cancelar</Button>
      </div>
    </Container>
  )

  const bodyEliminar = (
    <Container component={Paper} maxWidth="sm">
      <br /><br />
      <p>Estás seguro que deseas eliminar el libro <b>{libroSeleccionado && libroSeleccionado.tittle}</b> ? </p>
      <div align="right">
        <Button color="secondary" onClick={() => borrarDelete()} >Sí</Button>
        <Button onClick={() => abrirCerrarModalEliminar()}>No</Button>
      </div>
    </Container>

  )

  return (
    <div className="App">
      
      <Container>
        <h1>Gestión de Libros</h1>
        <div className="search">
          <TextField
            id="outlined-basic"
            onChange={inputHandler}
            variant="outlined"
            fullWidth
            label="Buscar"
          />
        </div>   
      </Container>

      <br />
      <br />
      <Container maxWidth="lg">
        <Button variant="outlined" color="secondary" onClick={() => abrirCerrarModalInsertar()}>
          Agregar
        </Button>
      </Container>
      <br />
      <br />

      <Container maxWidth="lg">
        <TableContainer component={Paper} >
          <Table size="small">
            <TableHead>
              <StyledTableRow>
                <StyledTableCell align="right">Título</StyledTableCell>
                <StyledTableCell align="right">Genero</StyledTableCell>
                <StyledTableCell align="right">Fecha de publicacion</StyledTableCell>
                <StyledTableCell align="right">Paginas</StyledTableCell>
                <StyledTableCell align="right">Sinopsis </StyledTableCell>
                <StyledTableCell align="right">Acciones</StyledTableCell>
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {data
                .filter((libro => {
                    if (inputText === '') {
                      return libro;
                    } else if (libro.tittle.toLowerCase().includes(inputText)) {
                      return libro;
                    }
                  }))
                .slice(page * rowsPerPage, (page * rowsPerPage) + rowsPerPage)
                .map((libro) => (
                <StyledTableRow key={libro._id}>
                    <StyledTableCell align="right">{libro.tittle}</StyledTableCell>
                    <StyledTableCell align="right">{libro.Genero}</StyledTableCell>
                    <StyledTableCell align="right">{libro.dateOf.slice(0, 10)}</StyledTableCell>
                    <StyledTableCell align="right">{libro.numpages}</StyledTableCell>
                    <StyledTableCell align="right">{libro.sinopsis}</StyledTableCell>
                    <StyledTableCell align="right">

                      <EditIcon cursor='pointer' onClick={() => seleccionarLibro(libro, 'Editar')} />
                      &nbsp;&nbsp;&nbsp;
                      <DeleteIcon cursor='pointer' onClick={() => seleccionarLibro(libro, 'Eliminar')} />
                    </StyledTableCell>
                  </StyledTableRow>
                )
                )
              }
            </TableBody>

          </Table>

          <TablePagination
            component="div"
            rowsPerPageOptions={[5, 10, 15, 20]}
            labelRowsPerPage='Numero de Elementos'
            count={data.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />

        </TableContainer>
      </Container>

      <Modal
        open={modalInsertar}
        onClose={abrirCerrarModalInsertar}>
        {bodyInsertar}
      </Modal>

      <Modal
        open={modalEditar}
        onClose={abrirCerrarModalEditar}>
        {bodyEditar}
      </Modal>

      <Modal
        open={modalEliminar}
        onClose={abrirCerrarModalEliminar}>
        {bodyEliminar}
      </Modal>

    </div>
  );
}

export default App;