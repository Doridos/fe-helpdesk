<script>
    import {Route, Router} from "svelte-routing";
    import Login from "./routes/Login.svelte";
</script>

<Router>
    <Route path="/" component={Login} />
</Router>

