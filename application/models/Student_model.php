<?php
    class Student_model extends CI_Model{

        public function __construct(){
            // Load Database
            $this->load->database();
        }


        /**
         * get_students - Given a set of criteria, looks for a SET of students
         *      from db.
         *
         * @param Associative Array criteria: Fields to base select on
         * @return Array - Student records
         */
        public function get_students($criteria){
            // TODO
        } // End of get_students


        /**
         * create_student - Adds a new student record to students
         *      table
         *
         * @param  int $form_num Form Number to grab fields from
         * @return TRUE on success, FALSE otherwise
         */
        public function create_student($form_num){

            $data = array(
                "first_name"    =>  $this->input->post("first_name_".$form_num),
                "last_name"     =>  $this->input->post("last_name_".$form_num),
                "section_id"    =>  $this->input->post("sections_".$form_num)
            );

            // Check if record already exists first
            $query = $this->db->get_where("students", $data);

            if(empty($query->row_array())){
                $this->db->insert("students", $data);
                return TRUE;
            }

            return FALSE;
        } // End of create_student


        public function edit_student(){
            // TODO
        }


        public function delete_student(){
            // TODO
        }

    }

?>
