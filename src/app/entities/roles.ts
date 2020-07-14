export class Roles {
     user : any = {
        "roles": {
            "admin": {
                "enter_data": true,
                "pdf": true,
                "run_compare": true,
                "save_scenarios": true,
                "rename_scenarios": true,
                "reset": true,
                "infra_towers_access": {
                    "enter_data": true,
                    "pdf": true,
                    "run_compare": true,
                    "save_scenarios": true,
                    "rename_scenarios": true,
                    "reset": true,
                    "accept_data_into_db": true,
                    "delete_scenarios" : true,
                    "specify_fields_on_user_page" : true 
                }
            },
            "demo_sales_lite": {
                "enter_data": false,
                "pdf": true,
                "run_compare": true,
                "save_scenarios": false,
                "rename_scenarios": false,
                "reset": false,
                "infra_towers_access": {
                    "enter_data": false,
                    "pdf": true,
                    "run_compare": true,
                    "save_scenarios": false,
                    "rename_scenarios": false,
                    "reset": false,
                    "accept_data_into_db": false,
                    "delete_scenarios" : false,
                    "specify_fields_on_user_page" : false 
                }
            },
            "external_user": {
                "enter_data": true,
                "pdf": true,
                "run_compare": true,
                "save_scenarios": true,
                "rename_scenarios": true,
                "reset": true,
                "infra_towers_access": {
                    "enter_data": true,
                    "pdf": true,
                    "run_compare": true,
                    "save_scenarios": true,
                    "rename_scenarios": true,
                    "reset": true,
                    "accept_data_into_db": false,
                    "delete_scenarios" : true,
                    "specify_fields_on_user_page" : false 
                }
            }
        }
    }

}
