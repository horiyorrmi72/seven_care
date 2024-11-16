import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import axios from 'axios';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  assetPath = '../../../assets';
  formdata: FormGroup;

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.formdata = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit(): void { }

  async onSubmit() {
    if (this.formdata.valid) {
      const formValue = this.formdata.value;
      // const { email, password } = this.formdata.value;
      const payload = {
        email: formValue.email,
        password: formValue.password
      }

      try {
       
        const response = await axios.post('http://localhost:3000/api/auth/signin',payload);
        console.log('Data sent to the server', response.status);
        this.toastr.success(`Login successful!`, 'Success');
        this.router.navigate(['/dashboard']);
        
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          console.error('Error sending data to the server', error);
          this.toastr.error(`${error.response.data.message}`, 'Login Error');
        } else {
          this.toastr.warning('Unable to Communicate with the Server.', 'Connection Error');
        }
      }
    } else {
      this.toastr.warning('Invalid Email or Password!');
    }
  }
}
