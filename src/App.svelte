<script>
    import {Route, Router} from "svelte-routing";
    import Login from "./routes/Login.svelte";
    import MainTable from "./routes/MainTable.svelte";
</script>

<Router>
    <Route path="/" component={Login} />
    <Route path="/requests" component={MainTable} />
</Router>

