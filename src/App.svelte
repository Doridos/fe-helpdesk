<script>
    import {Route, Router} from "svelte-routing";
    import Login from "./routes/Login.svelte";
    import MainTable from "./routes/MainTable.svelte";
    import SettingsTable from "./routes/SettingsTable.svelte";
    import ManagerDashboard from "./routes/ManagerDashboard.svelte";
</script>

<Router>
    <Route path="/" component={Login} />
    <Route path="/requests/" component={MainTable} />
    <Route path="/requests/:id" let:params component={MainTable} />
    <Route path="/settings" component={SettingsTable} />
    <Route path="/dashboard/" component={ManagerDashboard} />

</Router>

