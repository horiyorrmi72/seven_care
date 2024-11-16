import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import axios, { Axios } from 'axios';
import {Router} from '@angular/router'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  assetPath = '../../../assets';
  formdata: FormGroup = new FormGroup({});

  constructor(private fb: FormBuilder, private toastr: ToastrService, private router:Router) { }

  ngOnInit(): void {
    this.formdata = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
      address: ['', [Validators.required]],
      dob: ['', [Validators.required]],
      allergies: ['', [Validators.required]],
      medications: ['', [Validators.required]],
      lifestyle: ['', [Validators.required]],
      emergencyContact: ['', [Validators.required]],
    });
  }

  async onSubmit() {
    if (this.formdata.valid) {
      const formValue = this.formdata.value;

      const payload = {
        firstname: formValue.firstName,
        lastname: formValue.lastName,
        email: formValue.email,
        phone: formValue.phone,
        gender: formValue.gender,
        password: formValue.password,
        confirmPassword: formValue.confirmPassword,
        address: formValue.address,
        DOB: formValue.dob,
        medical_history: {
          allergies: formValue.allergies.split(',').map((item: string) => item.trim()),
          current_medications: formValue.medications.split(',').map((item: string) => item.trim()),
          life_style: formValue.lifestyle,
          emergency_contact: formValue.emergencyContact
        }
      };

      try {
        const response = await axios.post('http://localhost:3000/api/auth/signup', payload);
        console.log('Data sent to the server', response.data);
        this.toastr.success('Registration successful!', 'Success');
        this.formdata.reset();
        this.router.navigate(['/signin'])
      

      } catch (error) {
        if (axios.isAxiosError(error) && error) {
          console.error('Error sending data to the server', error);
          this.toastr.error(`Registration failed!: ${error.response?.data.message}`);
        } else {
          this.toastr.warning('Make sure all data have been provided😇!')
        }
      }
    }
  }
}
