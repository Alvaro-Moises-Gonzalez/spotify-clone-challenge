<template>
   <tr>
      <td>1</td>
      <td>
        <img class="track-art" src="@/assets/placeholder.jpg" alt="Track art"/>
        <p class="title">titulo</p>
        <p class="author">Autor</p>
      </td>
      <td>Album</td>
      <td>Añadido</td>
      <td>Duracion</td>
    </tr>
</template>

<script>

</script>

<style>
tr {
  display: table-row;
  color: white;
  font-size: 2.2rem;
  text-align: left;
  text-transform: capitalize;
}

.author{
  font-size: 1.5rem;
  color: rgba( 255, 255, 255, 0.5);
}

.track-art {
  width: 50px;
  height: 50px;
  float: left;
  margin: 5px;
  border-radius: 15px;
}
</style>
