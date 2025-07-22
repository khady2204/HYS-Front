import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, IonSelectOption, IonSelect } from '@ionic/angular/standalone';
import { FloatingMenuComponent } from 'src/app/components/floating-menu/floating-menu.component';


@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, FloatingMenuComponent]
})
export class EditProfilePage implements OnInit {

  editProfileForm! : FormGroup;
  profileImagePreview: string | ArrayBuffer | null = null;

  constructor(private location: Location, private fb: FormBuilder) { }

  ngOnInit() {
    this.editProfileForm = this.fb.group({
      name: [''],
      email: [''],
      password: [''],
      dob: [''],
      country: [''],
      profileImage: [null]
    });

    // Précharger les données utilisateur ici

  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.profileImagePreview = reader.result;
      };
      reader.readAsDataURL(file);
      this.editProfileForm.patchValue({ profileImage: file });
    }
  }

  onSubmit() {
    if (this.editProfileForm.valid) {
      // Envoyer les données du formulaire au serveur
    }
  }

  goBack() {
    this.location.back();
  }

}
