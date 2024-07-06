<script>
    import Header from "../lib/Header.svelte";
    import {formatDateAndTime, parseJwt} from "../lib/utils.js";
    import {
        Accordion,
        AccordionItem,
        Alert,
        Button,
        Checkbox,
        Dropdown,
        DropdownDivider,
        DropdownItem,
        Input,
        Label,
        Li,
        List,
        Modal,
        MultiSelect,
        Search,
        Select,
        Table,
        TableBody,
        TableBodyCell,
        TableBodyRow,
        TableHead,
        TableHeadCell,
        Textarea
    } from "flowbite-svelte";
    import {
        ChevronDownOutline,
        ChevronUpOutline,
        CirclePlusSolid,
        CloseCircleSolid,
        SearchOutline
    } from "flowbite-svelte-icons";
    import {navigate} from "svelte-routing";

    // Exported variable
    export let id;

    // Local variables
    let requestModal
    let requests = []
    let userCurrentUserCategories = []
    let jwt = localStorage.getItem("jwt")

    // Fetch user details and set categories
    if(jwt){
        fetchUserDetail().then((data) => {
            userCurrentUserCategories = data.categories
        })
    }

    /**
     * Fetches requests based on the request type.
     * @param {string} requestType - The type of request to fetch.
     * @returns {Promise} - A promise that resolves to an array of requests.
     */
    function fetchRequests(requestType) {
        if (requestType === "/assigned/by/" || requestType === "/assigned/to/") {
            requestType += parseJwt(jwt).sub

            return fetch(import.meta.env.VITE_BE_URL + "/request" + requestType, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + `${jwt}`,
                },
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json(); // This returns a promise
                })
                .then(data => {
                    // Map the data right after it is received
                    requests = data.map(request => ({
                        ...request,
                        requestState: stateMapping[request.requestState],
                        requestCategory: categoryMapping[request.requestCategory],
                        requestPriority: priorityMapping[request.requestPriority]
                    }));
                    console.log(requests);
                    return requests; // Return the requests
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        } else if (requestType === "/categories/") {
            requestType = "/categories"
            return fetch(import.meta.env.VITE_BE_URL + "/request" + requestType, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + `${jwt}`,
                },
                body: JSON.stringify(userCurrentUserCategories)
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json(); // This returns a promise
                })
                .then(data => {
                    // Map the data right after it is received
                    requests = data.map(request => ({
                        ...request,
                        requestState: stateMapping[request.requestState],
                        requestCategory: categoryMapping[request.requestCategory],
                        requestPriority: priorityMapping[request.requestPriority]
                    }));
                    console.log(requests);
                    return requests; // Return the requests
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        } else {
            return fetch(import.meta.env.VITE_BE_URL + "/request" + requestType, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + `${jwt}`
                }
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json(); // This returns a promise
                })
                .then(data => {
                    // Map the data right after it is received
                    requests = data.map(request => ({
                        ...request,
                        requestState: stateMapping[request.requestState],
                        requestCategory: categoryMapping[request.requestCategory],
                        requestPriority: priorityMapping[request.requestPriority]
                    }));
                    console.log(requests);
                    return requests; // Return the requests
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        }

    }

    let requestComments = []
    let commentToPost


    /**
     * Fetches user details.
     * @returns {Promise} - A promise that resolves to user details.
     */
    function fetchUserDetail() {
        return fetch(import.meta.env.VITE_BE_URL + "/employees/user/" + parseJwt(jwt).sub, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + `${jwt}`,
            },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json(); // This returns a promise
            })
            .then(data => {
                // Map the data right after it is received
                console.log(data);
                return data
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    /**
     * Fetches request details.
     * @param {string} requestId - The ID of the request to fetch.
     * @returns {Promise} - A promise that resolves to request details.
     */
    function fetchRequestDetail(requestId) {
        return fetch(import.meta.env.VITE_BE_URL + "/request/" + requestId, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + `${jwt}`,
            },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json(); // This returns a promise
            })
            .then(data => {
                // Map the data right after it is received
                console.log(data);
                requestComments = data.comments
                return data
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    $: filteredItems = requests.filter((request) => request.name.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 && filtersByState[request.requestState] && filtersByCategory[request.requestCategory]
        && filtersByPriority[request.requestPriority]);
    $: pageItems = filteredItems.slice((currentPage - 1) * itemsPerPage, (currentPage - 1) * itemsPerPage + itemsPerPage)
    $: totalPages = Math.ceil(filteredItems.length / itemsPerPage);

    let searchTerm = ''

    let requestId
    let requestName
    let requestDescription
    let requestState
    let requestCategory
    let requestPriority
    let requestAssignedBy
    let requestAssignedByUsername
    let requestAssignedTo
    let requestAssignedToNames
    let requestDateOfAnnouncement
    let requestDateOfCompletion
    let solvers = []

    function newRequest() {
        nameStar = false
        descriptionStar = false
        categoryStar = false
        priorityStar = false
        stateStar = false
        requestSubmitFailure = false
        requestModal = true
        requestName = ""
        requestDescription = ""
        requestState = "NEW"
        requestCategory = ""
        requestPriority = 'LOW'
        requestAssignedBy = ""
        requestAssignedTo = ""
        requestDateOfAnnouncement = ""
        requestDateOfCompletion = ""
    }

    function setCurrentRequest(id) {
        nameStar = false
        descriptionStar = false
        categoryStar = false
        priorityStar = false
        stateStar = false
        requestSubmitFailure = false
        commentError = false
        console.log(id)
        let requestToSet = requests.find(request => request.id === id)
        if (requestToSet) {
            console.log(requestToSet)
            requestId = requestToSet.id
            requestName = requestToSet.name
            requestDescription = requestToSet.description
            requestComments = requestToSet.comments
            switch (requestToSet.requestCategory) {
                case "Intranet":
                    requestCategory = 'INTRANET'
                    break
                case "Software":
                    requestCategory = 'SOFTWARE'
                    break
                case "Majetek":
                    requestCategory = 'PROPERTY'
                    break
                case "Hardware":
                    requestCategory = 'HARDWARE'
                    break
                case "Oprávnění":
                    requestCategory = 'PERMISSION'
                    break
                case "Jiné":
                    requestCategory = 'OTHER'
                    break
                default:
                    requestCategory = 'INTRANET'
                    break
            }
            fetch(import.meta.env.VITE_BE_URL + "/employees/" + requestCategory, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + `${jwt}`,
                },
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json(); // This returns a promise
                })
                .then(data => {
                    console.log(data);
                    solvers = data.map(solver => ({
                        value: solver.username,
                        name: solver.forename + " " + solver.surname
                    }));
                    requestAssignedTo = requestToSet.assignedTo.map(solver => solver.username)
                    requestAssignedToNames = requestToSet.assignedTo.map(solver => solver.forename + " " + solver.surname)
                    console.log(requestAssignedToNames)
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
            switch (requestToSet.requestPriority) {

                case "Nízká":
                    requestPriority = 'LOW'
                    break
                case "Střední":
                    requestPriority = 'MEDIUM'
                    break
                case "Vysoká":
                    requestPriority = 'HIGH'
                    console.log(requestPriority)
                    break
                case "Kritická":
                    requestPriority = 'CRITICAL'
                    console.log(requestPriority)
                    break
                default:
                    requestPriority = 'LOW'
                    break
            }
            switch (requestToSet.requestState) {
                case "Nový":
                    requestState = 'NEW'
                    break
                case "V řešení":
                    requestState = 'IN_PROGRESS'
                    break
                case "Vyřešen":
                    requestState = 'SOLVED'
                    break
                case "Neplatný":
                    requestState = 'INVALID'
                    break
                default:
                    requestState = 'NEW'
                    break
            }


            requestDateOfAnnouncement = formatDateAndTime(requestToSet.dateOfAnnouncement)
            if (requestToSet.dateOfCompletion) {
                requestDateOfCompletion = formatDateAndTime(requestToSet.dateOfCompletion)
            } else {
                requestDateOfCompletion = null
            }

            requestAssignedByUsername = requestToSet.assignedBy.username
            requestAssignedBy = requestToSet.assignedBy.forename + " " + requestToSet.assignedBy.surname
        } else {
            return false
        }


    }

    function getSolversByCategory() {
        fetch(import.meta.env.VITE_BE_URL + "/employees/" + requestCategory, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + `${jwt}`,
            },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json(); // This returns a promise
            })
            .then(data => {
                console.log(data);
                solvers = data.map(solver => ({
                    value: solver.username,
                    name: solver.forename + " " + solver.surname
                }));
                requestAssignedTo = []
                console.log()
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }


    /**
     * Sends a POST request to create a new request.
     * @returns {Promise} - A promise that resolves to the response of the POST request.
     */
    function sendPostRequest() {
        return fetch(import.meta.env.VITE_BE_URL + "/request/post", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + `${jwt}`,
            },
            body: JSON.stringify({
                "name": requestName,
                "description": requestDescription,
                "assignedBy": parseJwt(jwt).sub,
                "requestState": "NEW",
                "requestCategory": requestCategory,
                "requestPriority": requestPriority
            }),
        })
            .then(response => response.json())
            .then(data => console.log(data))
            .catch((error) => {
                console.error('Error:', error);
            });

    }

    /**
     * Sends a POST request to create a new comment.
     * @returns {Promise} - A promise that resolves to the response of the POST request.
     */
    function sendPostComment() {
        return fetch(import.meta.env.VITE_BE_URL + "/comment", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + `${jwt}`,
            },
            body: JSON.stringify({
                "content": commentToPost,
                "authorUsername": parseJwt(jwt).sub,
                "requestId": requestId
            }),
        })
            .then(response => response.json())
            .then(data => console.log(data))
            .catch((error) => {
                console.error('Error:', error);
            });

    }

    /**
     * Sends a PUT request to update a request.
     * @param {Object} data - The data to update the request with.
     * @returns {Promise} - A promise that resolves to the response of the PUT request.
     */
    function sendPutRequest(data) {
        return fetch(import.meta.env.VITE_BE_URL + "/request/" + requestId, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + `${jwt}`
            },
            body: JSON.stringify(data),
        })
            .then(response => {
                return response.json();
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    let nameStar = false
    let descriptionStar = false
    let categoryStar = false
    let priorityStar = false
    let stateStar = false
    let requestSubmitFailure = false


    /**
     * Validates a request.
     * @returns {boolean} - Whether the request is valid.
     */
    function validateRequest() {
        let result = false
        requestSubmitFailure = true
        if (!requestName || requestName === "")
            nameStar = true
        if (!requestDescription || requestDescription === "")
            descriptionStar = true
        if (!requestCategory || requestCategory === "")
            categoryStar = true
        if (!requestPriority || requestPriority === "") {
            priorityStar = true

        }
        if (requestName && requestDescription && requestCategory && requestPriority &&
            requestName !== "" && requestDescription !== "" && requestCategory !== "" && requestPriority !== "") {
            nameStar = false
            descriptionStar = false
            categoryStar = false
            priorityStar = false
            result = true
            requestSubmitFailure = false
        }
        return result;
    }


    /**
     * Validates an update request.
     * @returns {boolean} - Whether the update request is valid.
     */
    function validateUpdateRequest() {
        let result = false
        requestSubmitFailure = true
        if (!requestName || requestName === "")
            nameStar = true
        if (!requestDescription || requestDescription === "")
            descriptionStar = true
        if (!requestCategory || requestCategory === "")
            categoryStar = true
        if (!requestPriority || requestPriority === "") {
            priorityStar = true
        }
        if (!requestState || requestState === "") {
            stateStar = true
        }
        if (requestName && requestDescription && requestCategory && requestPriority && requestState &&
            requestName !== "" && requestDescription !== "" && requestCategory !== "" && requestPriority !== "" && requestState !== "") {
            nameStar = false
            descriptionStar = false
            categoryStar = false
            priorityStar = false
            stateStar = true
            result = true
            requestSubmitFailure = false
        }
        return result;
    }

    /**
     * Posts a request.
     */
    function postRequest() {
        if (!validateRequest()) {
            return;
        }
        sendPostRequest().then(() => {
            fetchRequests(selectedTypeOfRequests).then(() => {
                sortItems()
                requestModal = false
            });
        });
    }

    let commentError = false

    /**
     * Validates a comment.
     * @returns {boolean} - Whether the comment is valid.
     */
    function validateComment() {
        if (!commentToPost || commentToPost.trim() === '') {
            commentError = true
            return false;
        } else {
            commentError = false
            return true
        }

    }

    /**
     * Posts a comment.
     */
    function postComment() {
        if (!validateComment()) {
            return;
        }
        sendPostComment().then(() => {
            fetchRequestDetail(requestId).then(() => {
                requestModal = true
                fetchRequests(selectedTypeOfRequests).then(() => {
                    sortItems()
                });
            });
        });
        commentToPost = null
    }

    /**
     * Updates a request.
     */
    function updateRequest() {
        const data = {
            "name": requestName,
            "description": requestDescription,
            "assignedTo": requestAssignedTo,
            "requestState": requestState,
            "requestCategory": requestCategory,
            "requestPriority": requestPriority
        };
        console.log(data)
        if (!validateUpdateRequest()) {
            return;
        }
        sendPutRequest(data).then(() => {
            fetchRequests(selectedTypeOfRequests).then(() => {
                sortItems()
            });
            requestModal = false
        });
        console.log(requests)
    }

    function stateClass(state) {
        switch (state) {
            case 'Nový':
                return 'bg-yellow-100 w-fit p-1 text-yellow-600 rounded';
            case 'V řešení':
                return 'bg-purple-100 w-fit p-1 text-purple-800 rounded';
            case 'Vyřešen':
                return 'bg-green-100 w-fit p-1 text-green-800 rounded';
            case 'Neplatný':
                return 'bg-red-100 w-fit p-1 text-red-800 rounded';
            default:
                return '';
        }
    }

    function priorityClass(state) {
        switch (state) {
            case 'Nízká':
                return 'bg-green-100 w-fit p-1 text-green-800 rounded';
            case 'Střední':
                return 'bg-yellow-300 w-fit p-1 text-yellow-800 rounded';
            case 'Vysoká':
                return 'bg-red-200 w-fit p-1 text-red-800 rounded';
            case 'Kritická':
                return 'bg-red-600 w-fit p-1 text-white rounded';
            default:
                return '';
        }
    }

    function categoryClass(state) {
        switch (state) {
            case 'Intranet':
                return 'bg-red-800 w-fit p-1 text-white rounded';
            case 'Software':
                return 'bg-blue-700 w-fit p-1 text-white rounded';
            case 'Majetek':
                return 'bg-green-200 w-fit p-1 text-gray-900 rounded';
            case 'Hardware':
                return 'bg-yellow-800 w-fit p-1 text-white rounded';
            case 'Oprávnění':
                return 'bg-purple-800 w-fit p-1 text-purple-100 rounded';
            case 'Jiné':
                return 'bg-pink-100 w-fit p-1 text-pink-800 rounded';
            default:
                return '';
        }
    }

    let selectedCategory
    let categories = [
        {value: 'INTRANET', name: 'Intranet'},
        {value: 'SOFTWARE', name: 'Software'},
        {value: 'PROPERTY', name: 'Majetek'},
        {value: 'HARDWARE', name: 'Hardware'},
        {value: 'PERMISSION', name: 'Oprávnění'},
        {value: 'OTHER', name: 'Jiné'}
    ];
    let filtersByCategory = {
        "Intranet": true,
        "Software": true,
        "Majetek": true,
        "Hardware": true,
        "Oprávnění": true,
        "Jiné": true
    }

    let priority = [
        {value: 'LOW', name: 'Nízká'},
        {value: 'MEDIUM', name: 'Střední'},
        {value: 'HIGH', name: 'Vysoká'},
        {value: 'CRITICAL', name: 'Kritická'},
    ];
    let filtersByPriority = {
        "Nízká": true,
        "Střední": true,
        "Vysoká": true,
        "Kritická": true,
    }

    let selectedTypeOfRequests

    $: {
        if (jwt && selectedTypeOfRequests) {

            fetchRequests(selectedTypeOfRequests).then(() => {
                sortDirection = "desc"
                sortItems()
                if (id) {
                    if (setCurrentRequest(Number(id)) === false) {
                        requestModal = false
                    } else {
                        requestModal = true
                    }
                }
            });
            // Do something with selectedRequestType
            console.log(`Selected request type: ${selectedTypeOfRequests}`);
        }
    }

    let state = [
        {value: 'NEW', name: 'Nový'},
        {value: 'IN_PROGRESS', name: 'V řešení'},
        {value: 'SOLVED', name: 'Vyřešen'},
        {value: 'INVALID', name: 'Neplatný'},
    ];
    let filtersByState = {
        "Nový": true,
        "V řešení": true,
        "Vyřešen": true,
        "Neplatný": true,
    }
    const stateMapping = {
        "NEW": "Nový",
        "IN_PROGRESS": "V řešení",
        "SOLVED": "Vyřešen",
        "INVALID": "Neplatný"
    };

    const categoryMapping = {
        "INTRANET": "Intranet",
        "SOFTWARE": "Software",
        "PROPERTY": "Majetek",
        "HARDWARE": "Hardware",
        "PERMISSION": "Oprávnění",
        "OTHER": "Jiné"
    };

    const priorityMapping = {
        "LOW": "Nízká",
        "MEDIUM": "Střední",
        "HIGH": "Vysoká",
        "CRITICAL": "Kritická"
    };

    let typeOfRequests;

    if (jwt && parseJwt(jwt).role === "EMPLOYEE") {
        selectedTypeOfRequests = '/assigned/by/'
        typeOfRequests = [
            {value: '/assigned/by/', name: 'Mé zadané požadavky'},
        ];
    } else if (jwt && parseJwt(jwt).role === "SOLVER") {
        selectedTypeOfRequests = '/assigned/by/'
        typeOfRequests = [
            {value: '/assigned/by/', name: 'Mé zadané požadavky'},
            {value: '/assigned/to/', name: 'Požadavky, které řeším'},
            {value: '/categories/', name: 'Mé přiřazené kategorie'},
        ];
    } else if (jwt && parseJwt(jwt).role === "MANAGER") {
        selectedTypeOfRequests = '/all'
        typeOfRequests = [
            {value: '/assigned/by/', name: 'Mé zadané požadavky'},
            {value: '/assigned/to/', name: 'Požadavky, které řeším'},
            {value: '/categories/', name: 'Mé přiřazené kategorie'},
            {value: '/all', name: 'Všechny požadavky'},
        ];
    } else if (jwt && parseJwt(jwt).role === "ADMIN") {
        selectedTypeOfRequests = '/all'
        typeOfRequests = [
            {value: '/assigned/by/', name: 'Mé zadané požadavky'},
            {value: '/assigned/to/', name: 'Požadavky, které řeším'},
            {value: '/categories/', name: 'Mé přiřazené kategorie'},
            {value: '/all', name: 'Všechny požadavky'},
        ];
    }

    let filterActive = false
    let currentPage = 1;
    const itemsPerPage = 12;

    function setPage(page) {
        currentPage = page;
    }

    function prevPage() {
        if (currentPage > 1) {
            currentPage--;
        }
    }

    function nextPage() {
        if (currentPage < totalPages) {
            currentPage++;
        }
    }

    let sortDirection = 'asc';
    let sortBy = 'id';

    function sortItems() {
        if (sortBy === 'id') {
            if (sortDirection === 'asc') {
                requests = requests.sort((a, b) => a[sortBy] - b[sortBy]);
            } else {
                requests = requests.sort((a, b) => b[sortBy] - a[sortBy]);
            }
        } else {
            if (sortDirection === 'asc') {
                requests = requests.sort((a, b) => a[sortBy].localeCompare(b[sortBy]));
                console.log(requests)
            } else {
                requests = requests.sort((a, b) => b[sortBy].localeCompare(a[sortBy]));
                console.log(requests)
            }
        }
    }


    function resetSort() {
        filterActive = false
        stateDropdownActive = false
        categoryDropdownActive = false
        priorityDropdownActive = false
        idSort = false
        sortByIdAsc = true
        sortDirection = 'asc'
        sortBy = 'id'
        filterActive = false
        sortItems()
    }


    let sortByIdAsc = false


    let stateDropdownActive = false
    let categoryDropdownActive = false
    let priorityDropdownActive = false
    let idSort = false
    $: title = requestName ? requestName : "Založení nového požadavku";
</script>

<div>
    <Modal size="lg" {title} bind:open={requestModal} on:close={() => navigate("/requests")}>

        <div class="container">
            <!-- Main Section (2/3 width) -->
            <div class="main-section">
                {#if requestAssignedBy === ""}
                    <Label for="request-name" class="mb-2">Název požadavku<span
                            class:error-color={nameStar}>*</span></Label>
                    <Input type="text" id="request-name" class="mb-1 focus:border-blue-700 focus:ring-blue-700"
                           bind:value={requestName} placeholder="Zadejte název požadavku" required/>
                {/if}
                <label for="request-description" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Popis
                    požadavku<span class:error-color={descriptionStar}>*</span></label>
                <textarea bind:value={requestDescription} id="request-description" rows="4"
                          class="mb-1 block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-700 focus:border-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          placeholder="Popište svůj požadavek"></textarea>
                <Label>
                    Kategorie<span class:error-color={categoryStar}>*</span>
                    <Select class="mt-2 mb-1 focus:border-blue-700 focus:ring-blue-700" on:change={getSolversByCategory}
                            items={categories} bind:value={requestCategory} placeholder="Vyberte kategorii"/>
                </Label>
                <Label>
                    Priorita<span class:error-color={priorityStar}>*</span>
                    <Select class="mt-2 mb-1 focus:border-blue-700 focus:ring-blue-700" items={priority}
                            bind:value={requestPriority} placeholder="Vyberte prioritu"/>
                </Label>
                {#if requestAssignedBy !== ""}
                    <Label>
                        Stav<span class:error-color={stateStar}>*</span>
                        <Select class="mt-2 mb-1 focus:border-blue-700 focus:ring-blue-700" items={state}
                                bind:value={requestState} placeholder="Vyberte stav"/>
                    </Label>
                    {#if requestAssignedBy}
                        <Label for="assigned-by" class="mb-2">Požadavek založil/a</Label>
                        <Input type="text" id="assigned-by" class="mb-1 focus:border-blue-700 focus:ring-blue-700"
                               disabled bind:value={requestAssignedBy}/>
                    {/if}
                    {#if requestAssignedToNames && parseJwt(jwt).role === "EMPLOYEE"}
                        <Label for="assigned-by" class="mb-2">Přiřazený řešitel</Label>
                        <Input type="text" id="assigned-by" class="mb-1 focus:border-blue-700 focus:ring-blue-700"
                               disabled value={requestAssignedToNames.join(", ")}/>
                    {:else}
                        <Label>
                            Přiřazený řešitel
                            <MultiSelect
                                    class="mt-2 mb-1 disabled focus:border-blue-700 focus:ring-blue-700 focus-within:border-blue-700 focus-within:ring-blue-700"
                                    items={solvers} bind:value={requestAssignedTo}
                                    placeholder="Zvolte přiřazeného řešitele"/>
                        </Label>
                    {/if}
                    <Label for="date-of-announcement" class="mb-2">Datum ohlášení</Label>
                    <Input type="text" id="date-of-announcement" class="mb-1 focus:border-blue-700 focus:ring-blue-700"
                           disabled value={requestDateOfAnnouncement}/>
                    {#if requestDateOfCompletion}
                        <Label for="date-of-completion" class="mb-2">Datum dokončení</Label>
                        <Input type="text" id="date-of-completion"
                               class="mb-1 focus:border-blue-700 focus:ring-blue-700" disabled
                               value={requestDateOfCompletion}/>
                    {/if}
                {/if}
            </div>
            {#if requestAssignedBy}
                <div class="comment-section">
                    <h3>Komentáře</h3>
                    <div class="max-h-[480px] overflow-auto">
                        <!-- Display sample comments -->
                        {#each requestComments as comment}
                            <div class="comment">
                                <p class="author">{comment.author.forename + " " + comment.author.surname + " "}<span
                                        class="time"> {formatDateAndTime(comment.dateOfComment)}</span></p>
                                <p>{comment.content}</p>
                            </div>
                        {/each}
                    </div>
                    <Textarea class="mt-auto" rows="1" bind:value={commentToPost} placeholder="Napište komentář">
                        <div slot="footer" class="flex items-center justify-between">
                          <Button on:click={() => postComment()}
                                  class="bg-[#2362a2] hover:bg-[#254e80] focus-within:ring-opacity-0" type="submit">Odeslat komentář</Button>
                        </div>
                  </Textarea>
                </div>
            {:else}
                <div class="comment-section">
                    <h3>Nápověda</h3>
                    <div class="max-h-[480px] overflow-auto">
                        <Accordion flush size="ld">
                            <AccordionItem open>
                                <span slot="header">Kategorie</span>
                                <List list="disc" class="text-xs">
                                    <Li>Intranet - požadavky spojené s příspěvkem na intranet</Li>
                                    <Li>Software - požadavky spojené s programy na počítači</Li>
                                    <Li>Majetek - požadavky spojené s evidencí majetku</Li>
                                    <Li>Hardware - požadavky spojené s fyzickou poruchou počítače</Li>
                                    <Li>Oprávnění - požadavky spojené s přidělením oprávnění</Li>
                                    <Li>Jiné - požadavky, které nespadají do žádné z výše uvedených kategorií</Li>
                                </List>
                            </AccordionItem>
                            <AccordionItem>
                                <span slot="header">Priorita</span>
                                <List list="disc" class="text-xs">
                                    <Li>Nízká - ozveme se Vám do <b>32</b> pracovních hodin od nahlášení požadavku</Li>
                                    <Li>Střední - ozveme se Vám do <b>8</b> pracovních hodin od nahlášení požadavku</Li>
                                    <Li>Vysoká - ozveme se Vám do <b>3</b> pracovních hodin od nahlášení požadavku</Li>
                                    <Li>Kritická - ozveme se Vám do <b>1</b> pracovní hodiny od nahlášení požadavku</Li>
                                </List>

                            </AccordionItem>
                        </Accordion>
                    </div>
                </div>
            {/if}

        </div>
        <svelte:fragment slot="footer">
            {#if requestAssignedBy}
                <Button class="bg-[#2362a2] hover:bg-[#254e80] focus-within:ring-opacity-0"
                        on:click={() => updateRequest()}>Změnit
                </Button>
            {:else}
                <Button class="bg-[#2362a2] hover:bg-[#254e80] focus-within:ring-opacity-0"
                        on:click={() => postRequest()}>Zadat
                </Button>
            {/if}
            {#if requestSubmitFailure}
                <Alert color="red">
                    <CloseCircleSolid slot="icon" class="text-red-600" size="sm"/>
                    Nejsou vyplněny všechny povinné položky.
                </Alert>
            {/if}
            {#if commentError}
                <Alert color="red">
                    <CloseCircleSolid slot="icon" class="text-red-600" size="sm"/>
                    Komentář nesmí být prázdný.
                </Alert>
            {/if}
        </svelte:fragment>
    </Modal>

    <Header></Header>
    <div class="page-background">
        {#if jwt && parseJwt(localStorage.getItem("jwt")).role && parseJwt(localStorage.getItem("jwt")).role !== "NON_ACTIVE"}
            <div class="page-content mt-[25] overflow-x-auto">
                <div class="flex justify-between items-center p-4">
                    <div class="flex w-1/3">
                        <Button on:click={newRequest} size="sm"
                                class="bg-[#2362a2] hover:bg-[#254e80] focus-within:ring-opacity-0">
                            <CirclePlusSolid class="mr-1" size="sm"/>
                            Založit požadavek
                        </Button>
                        {#if filterActive}
                            <Button on:click={resetSort} size="sm"
                                    class="ml-2 bg-transparent text-gray-600 hover:bg-transparent hover:text-gray-800 focus-within:ring-opacity-0">
                                <CloseCircleSolid class="mr-1" size="sm"/>
                                Zrušit řazení
                            </Button>
                        {/if}
                    </div>

                    <div class="flex w-1/3">
                        <Select class="w-10/12 focus:border-blue-700 focus:ring-blue-700 mr-3" items={typeOfRequests}
                                bind:value={selectedTypeOfRequests} placeholder="Vyberte pohled"/>

                        <Search size="md"
                                class="rounded-none py-2.5 focus:border-blue-700 focus:ring-blue-700 focus:ring-opacity-5"
                                placeholder="Vyhledat požadavek" bind:value={searchTerm}/>
                        <Button class="p-2.5 rounded-s-none bg-[#2362a2] hover:bg-[#254e80] focus-within:ring-opacity-0">
                            <SearchOutline class="w-5 h-5 "/>
                        </Button>
                    </div>
                </div>
                <Table striped={true} divClass="min-height" class="xl:table-fixed w-full h-1/2">
                    <TableHead>
                        <TableHeadCell>
                            <div class="flex items-center">POŽADAVEK</div>
                        </TableHeadCell>
                        <TableHeadCell>
                            <div class="flex items-center">POPIS POŽADAVKU</div>
                        </TableHeadCell>
                        <TableHeadCell>
                            <div class="{sortBy === 'requestState' ? 'text-orange-500' : ''} flex items-center hover:cursor-pointer"
                                 on:click={() => {stateDropdownActive = !stateDropdownActive
                    }}>STAV
                                {#if !stateDropdownActive}
                                    <ChevronDownOutline class="mr-1 hover:cursor-pointer ml-1 " size="sm"/>
                                {:else}
                                    <ChevronUpOutline class="mr-1 hover:cursor-pointer ml-1" size="sm"/>
                                {/if}
                            </div>
                            <Dropdown>
                                <DropdownItem on:click={() => {
                                //Gui chevron changes
                                categoryDropdownActive = false
                                priorityDropdownActive = false
                                idSort = false
                                sortByIdAsc = true
                                //End chevron changes
                                filterActive = true
                                sortBy = 'requestState';
                                sortDirection = 'asc'
                                sortItems()
                            }}>Vzestupně
                                </DropdownItem>
                                <DropdownItem on:click={() => {
                                 //Gui chevron changes
                                categoryDropdownActive = false
                                priorityDropdownActive = false
                                idSort = false
                                sortByIdAsc = true
                                //End chevron changes
                                filterActive = true
                                sortBy = 'requestState';
                                sortDirection = 'desc'
                            sortItems()
                        }}>Sestupně
                                </DropdownItem>
                                <DropdownDivider/>
                                <DropdownItem>
                                    <Checkbox bind:checked={filtersByState.Nový}>Nový</Checkbox>
                                </DropdownItem>
                                <DropdownItem>
                                    <Checkbox bind:checked={filtersByState.Neplatný}>Neplatný</Checkbox>
                                </DropdownItem>
                                <DropdownItem>
                                    <Checkbox bind:checked={filtersByState["V řešení"]}>V řešení</Checkbox>
                                </DropdownItem>
                                <DropdownItem>
                                    <Checkbox bind:checked={filtersByState.Vyřešen}>Vyřešen</Checkbox>
                                </DropdownItem>

                            </Dropdown>
                        </TableHeadCell>
                        <TableHeadCell>
                            <div class="{sortBy === 'requestCategory' ? 'text-orange-500' : ''} flex items-center hover:cursor-pointer"
                                 on:click={() => {categoryDropdownActive = !categoryDropdownActive}}>KATEGORIE
                                {#if !categoryDropdownActive}
                                    <ChevronDownOutline class="mr-1 hover:cursor-pointer ml-1" size="sm"/>
                                {:else}
                                    <ChevronUpOutline class="mr-1 hover:cursor-pointer ml-1" size="sm"/>
                                {/if}
                            </div>
                            <Dropdown>
                                <DropdownItem on:click={() => {
                                //Gui chevron changes
                                stateDropdownActive = false
                                priorityDropdownActive = false
                                idSort = false
                                sortByIdAsc = true
                                //End chevron changes
                                filterActive = true
                                sortBy = 'requestCategory';
                                sortDirection = 'asc'
                                sortItems()
                            }}>Vzestupně
                                </DropdownItem>
                                <DropdownItem on:click={() => {
                                //Gui chevron changes
                                stateDropdownActive = false
                                priorityDropdownActive = false
                                idSort = false
                                sortByIdAsc = true
                                //End chevron changes
                                filterActive = true
                                sortBy = 'requestCategory';
                                sortDirection = 'desc'
                            sortItems()
                        }}>Sestupně
                                </DropdownItem>
                                <DropdownDivider/>
                                <DropdownItem>
                                    <Checkbox bind:checked={filtersByCategory.Intranet}>Intranet</Checkbox>
                                </DropdownItem>
                                <DropdownItem>
                                    <Checkbox bind:checked={filtersByCategory.Software}>Software</Checkbox>
                                </DropdownItem>
                                <DropdownItem>
                                    <Checkbox bind:checked={filtersByCategory.Majetek}>Majetek</Checkbox>
                                </DropdownItem>
                                <DropdownItem>
                                    <Checkbox bind:checked={filtersByCategory.Hardware}>Hardware</Checkbox>
                                </DropdownItem>
                                <DropdownItem>
                                    <Checkbox bind:checked={filtersByCategory.Oprávnění}>Oprávnění</Checkbox>
                                </DropdownItem>
                                <DropdownItem>
                                    <Checkbox bind:checked={filtersByCategory.Jiné}>Jiné</Checkbox>
                                </DropdownItem>

                            </Dropdown>
                        </TableHeadCell>
                        <TableHeadCell>
                            <div class="{sortBy === 'requestPriority' ? 'text-orange-500' : ''} flex items-center hover:cursor-pointer"
                                 on:click={() => {priorityDropdownActive = !priorityDropdownActive}}>PRIORITA
                                {#if !priorityDropdownActive}
                                    <ChevronDownOutline class="mr-1 hover:cursor-pointer ml-1" size="sm"/>
                                {:else}
                                    <ChevronUpOutline class="mr-1 hover:cursor-pointer ml-1" size="sm"/>
                                {/if}
                            </div>
                            <Dropdown>
                                <DropdownItem on:click={() => {
                                //Gui chevron changes
                                stateDropdownActive = false
                                categoryDropdownActive = false
                                idSort = false
                                sortByIdAsc = true
                                //End chevron changes
                                filterActive = true
                                sortBy = 'requestPriority';
                                sortDirection = 'asc'
                                sortItems()
                            }}>Vzestupně
                                </DropdownItem>
                                <DropdownItem on:click={() => {
                                //Gui chevron changes
                                stateDropdownActive = false
                                categoryDropdownActive = false
                                idSort = false
                                sortByIdAsc = true
                                //End chevron changes
                                filterActive = true
                                sortBy = 'requestPriority';
                                sortDirection = 'desc'
                            sortItems()
                        }}>Sestupně
                                </DropdownItem>
                                <DropdownDivider/>
                                <DropdownItem>
                                    <Checkbox bind:checked={filtersByPriority.Nízká}>Nízká</Checkbox>
                                </DropdownItem>
                                <DropdownItem>
                                    <Checkbox bind:checked={filtersByPriority.Střední}>Střední</Checkbox>
                                </DropdownItem>
                                <DropdownItem>
                                    <Checkbox bind:checked={filtersByPriority.Vysoká}>Vysoká</Checkbox>
                                </DropdownItem>
                                <DropdownItem>
                                    <Checkbox bind:checked={filtersByPriority.Kritická}>Kritická</Checkbox>
                                </DropdownItem>

                            </Dropdown>
                        </TableHeadCell>
                        <TableHeadCell>
                            <div class="{idSort ? 'text-orange-500' : ''} flex items-center hover:cursor-pointer"
                                 on:click={ () => {
                    filterActive = true
                    idSort = true
                    sortByIdAsc = !sortByIdAsc
                    sortBy = 'id'
                    sortByIdAsc ? sortDirection = "asc" : sortDirection = "desc"
                    sortItems()
                    }
                    }>DATUM OHLÁŠENÍ
                                {#if sortByIdAsc}
                                    <ChevronDownOutline class="mr-1 hover:cursor-pointer ml-1 " size="sm"/>
                                {:else}
                                    <ChevronUpOutline class="mr-1 hover:cursor-pointer ml-1" size="sm"/>
                                {/if}
                            </div>
                        </TableHeadCell>
                        {#if parseJwt(localStorage.getItem("jwt")).role === "EMPLOYEE"}
                        <TableHeadCell>
                            <div class="flex items-center">ŘEŠITEL/KA</div>
                        </TableHeadCell>
                        {:else}
                        <TableHeadCell>
                            <div class="flex items-center">ŽADATEL/KA</div>
                        </TableHeadCell>
                        {/if}
                        <TableHeadCell>
                            <div class="flex items-center">DATUM DOKONČENÍ</div>
                        </TableHeadCell>
                    </TableHead>
                    {#if pageItems.length !== 0}
                        <TableBody>

                            {#each pageItems as request}
                                <TableBodyRow>
                                    <TableBodyCell class="cursor-pointer" on:click={() => {
                               setCurrentRequest(request.id)
                               requestModal = true}}>{request.name.length > 20 ? request.name.substring(0, 20) + "..." : request.name}</TableBodyCell>
                                    <TableBodyCell>{request.description.length > 20 ? request.description.substring(0, 20) + "..." : request.description}</TableBodyCell>
                                    <TableBodyCell><p
                                            class={stateClass(request.requestState)}>{request.requestState}</p>
                                    </TableBodyCell>
                                    <TableBodyCell><p
                                            class={categoryClass(request.requestCategory)}>{request.requestCategory}</p>
                                    </TableBodyCell>
                                    <TableBodyCell><p
                                            class={priorityClass(request.requestPriority)}>{request.requestPriority}</p>
                                    </TableBodyCell>
                                    <TableBodyCell>{formatDateAndTime(request.dateOfAnnouncement)}</TableBodyCell>
                                    {#if parseJwt(localStorage.getItem("jwt")).role === "EMPLOYEE"}
                                        {#if request.assignedTo.length > 0}
                                            <TableBodyCell>{request.assignedTo[0].forename + " " + request.assignedTo[0].surname}</TableBodyCell>
                                        {:else}
                                            <TableBodyCell>Nepřiřazeno</TableBodyCell>
                                        {/if}
                                    {:else}
                                        {#if request.assignedBy}
                                            <TableBodyCell>{request.assignedBy.forename + " " + request.assignedBy.surname}</TableBodyCell>
                                        {:else}
                                            <TableBodyCell>Nepřiřazeno</TableBodyCell>
                                        {/if}
                                    {/if}

                                    <TableBodyCell>{request.dateOfCompletion !== null ? formatDateAndTime(request.dateOfCompletion) : "" }</TableBodyCell>
                                </TableBodyRow>
                            {/each}
                        </TableBody>
                    {:else }
                        <h2 class="ml-6">Nenašli jsme žádné požadavky</h2>
                    {/if}
                </Table>
                <div class="pagination">
                    <button on:click={prevPage}>Zpět</button>
                    {#each Array.from({length: totalPages}, (_, i) => i + 1) as page}
                        <button
                                class:active={currentPage === page}
                                on:click={() => setPage(page)}
                        >
                            {page}
                        </button>
                    {/each}
                    <button on:click={nextPage}>Další</button>
                </div>
            </div>
            {:else if !jwt}
            <div class="page-content mt-[25]">
                <div class="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
                    <div class="mx-auto max-w-screen-sm text-center">
                        <h1 class="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-red-600 dark:text-primary-500">
                            401</h1>
                        <p class="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white">
                            Uživatel není přihlášen</p>
                        <Button on:click={() => navigate("/")}
                                class="mt-1.5 bg-[#2362a2] hover:bg-[#254e80] focus-within:ring-opacity-0"
                                type="submit">Zpátky na přihlašovací stránku
                        </Button>
                    </div>
                </div>
            </div>

        {:else}
            <div class="page-content mt-[25]">
                <div class="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
                    <div class="mx-auto max-w-screen-sm text-center">
                        <h1 class="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-red-600 dark:text-primary-500">
                            401</h1>
                        <p class="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white">
                            Stala se chyba...</p>
                        <Button on:click={() => navigate("/requests")}
                                class="mt-1.5 bg-[#2362a2] hover:bg-[#254e80] focus-within:ring-opacity-0"
                                type="submit">Zpátky na domovskou stránku
                        </Button>
                    </div>
                </div>
            </div>
        {/if}
    </div>

</div>

<style>

    .error-color {
        color: red;
    }

    .min-height {
        min-height: 300px;
    }

    .pagination {
        display: flex;
        justify-content: center;
        list-style: none;
        padding: 0;
        margin-top: 25px;
    }

    .pagination li {
        margin: 0 5px;
    }

    .pagination button {
        padding: 5px 10px;
        border: 1px solid #ccc;
        background-color: #fff;
        cursor: pointer;
    }

    .pagination button.active {
        background-color: #c0c0c0;
    }

    .pagination button:hover {
        background-color: #ececec;
    }

    .pagination button:first-child {
        border-top-left-radius: 5px;
        border-bottom-left-radius: 5px;
    }

    .pagination button:last-child {
        border-top-right-radius: 5px;
        border-bottom-right-radius: 5px;
    }

    .page-background {
        background-color: #f1f1f1;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
    }

    .page-content {
        width: 98%;
        box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
        background-color: white;
        border-radius: 7px;
        height: 97vh;
    }

    .comment {
        margin-bottom: 10px;
        font-size: 15px;
    }

    .author {
        font-size: 15px;
        font-weight: bold;
    }

    .time {
        font-size: 0.7em;
        color: #888;
    }

    .container {
        max-height: 650px;
        display: flex;
        flex-direction: row;
    }

    .main-section {
        flex: 2;
        padding-right: 20px; /* Add padding for spacing */
    }

    .comment-section {
        display: flex;
        flex: 1;
        flex-direction: column;
        border-left: 1px solid #ccc; /* Add border to separate main and comment sections */
        padding-left: 20px; /* Add padding for spacing */
    }
</style>
