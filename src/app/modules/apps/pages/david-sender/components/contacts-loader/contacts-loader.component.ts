
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'david-sender-contacts-loader',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contacts-loader.component.html',
  styleUrl: './contacts-loader.component.scss',
})
export class ContactsLoaderComponent {
  contacts: string[] = [];
  newContact: string = '';
  invalidContacts: number = 0;
  csvContacts: any[] = [];

  addContact() {
    if (!this.newContact || !this.newContact.trim()) {
      alert('Ingresa al menos un número.');
      return;
    }
    // Permitir múltiples números separados por coma, salto de línea, o entre comillas
    const raw = this.newContact.trim();
    // Quitar corchetes, comillas simples o dobles
    const cleaned = raw.replace(/[\[\]'"`]/g, '');
    // Separar por coma o salto de línea
    const numbers = cleaned.split(/[\s,]+/).map(n => n.trim()).filter(n => n.length > 0);
    let added = 0;
    for (const num of numbers) {
      // Normalizar: solo dígitos
      const digits = num.replace(/[^\d]/g, '');
      // Si empieza por 57 y tiene más de 10 dígitos, quitarlo
      const normalized = (digits.length > 10 && digits.startsWith('57')) ? digits.slice(digits.length - 10) : digits;
      if (/^\d{10}$/.test(normalized) && !this.contacts.includes(normalized)) {
        this.contacts.push(normalized);
        added++;
      }
      if (!/^\d{10}$/.test(normalized)) {
        this.invalidContacts++;
      }
    }
    if (added === 0) {
      alert('No se encontró ningún número válido de 10 dígitos.');
    }
    this.newContact = '';
  }

  removeContact(index: number) {
    this.contacts.splice(index, 1);
  }

  clearContacts() {
    this.contacts = [];
    this.csvContacts = [];
    this.invalidContacts = 0;
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.processCSVFile(input.files[0]);
    }
  }

  processContactsFromCSVFile(contactList: any[]) {
    if (!Array.isArray(contactList)) return;
    const normalized: any[] = [];
    for (const contact of contactList) {
      const obj: any = {};
      // Agrupadores por prefijo
      const groupers = [
        {
          key: 'phones',
          prefix: 'Phone ',
          label: 'Label',
          value: 'Value',
          normalize: (raw: string) => {
            let num = raw.replace(/[^\d]/g, '');
            if (num.length > 10 && num.startsWith('57'))
              num = num.slice(num.length - 10);
            const phoneObj: any = { raw, number: num };
            if (/^\d{10}$/.test(num)) phoneObj.phoneValid = true;
            return phoneObj;
          },
        },
        {
          key: 'emails',
          prefix: 'E-mail ',
          label: 'Label',
          value: 'Value',
          normalize: (raw: string) => ({ email: raw }),
        },
        {
          key: 'addresses',
          prefix: 'Address ',
          label: 'Label',
          value: 'Formatted',
          normalize: (raw: string) => ({ address: raw }),
        },
      ];
      // Inicializar agrupadores
      groupers.forEach((g) => (obj[g.key] = []));
      // Procesar campos
      for (const k in contact) {
        let matched = false;
        for (const g of groupers) {
          if (k.startsWith(g.prefix)) {
            matched = true;
            // Extraer índice (ej: Phone 1 - Label)
            const match = k.match(/(\d+)/);
            const idx = match ? parseInt(match[1], 10) : 1;
            // Buscar si ya existe el objeto para ese índice
            if (!obj[g.key][idx - 1]) obj[g.key][idx - 1] = {};
            if (k.endsWith(g.label)) obj[g.key][idx - 1].label = contact[k];
            if (k.endsWith(g.value)) obj[g.key][idx - 1].raw = contact[k];
          }
        }
        if (!matched) {
          obj[k] = contact[k];
        }
      }
      // Normalizar valores y limpiar vacíos
      groupers.forEach((g) => {
        obj[g.key] = obj[g.key]
          .filter((item: any) => item && (item.raw || item.label))
          .map((item: any) => {
            if (item.raw) {
              // Puede haber varios valores separados
              const raws = item.raw
                .split(/::+|,|\//)
                .map((s: string) => s.trim())
                .filter((s: string) => s);
              return raws.map((raw: string) => ({
                ...item,
                ...g.normalize(raw),
              }));
            }
            return null;
          })
          .flat()
          .filter((x: any) => x);
      });
      normalized.push(obj);
    }
    this.csvContacts = normalized;
    console.log('Contactos normalizados:', this.csvContacts);
    this.addValidPhonesFromCSVContacts();

  }

  parseCSVToContacts(csvText: string): any[] {
    const lines = csvText.split(/\r?\n/).filter((l) => l.trim().length > 0);
    if (lines.length < 2) return [];
    const headers = lines[0].split(',');
    const contacts = lines.slice(1).map((line) => {
      const values = line.split(',');
      const obj: any = {};
      headers.forEach((h, i) => {
        obj[h.trim()] = (values[i] || '').trim();
      });
      return obj;
    });
    return contacts;
  }
  processCSVFile(file: File) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const text = e.target.result;
      this.csvContacts = this.parseCSVToContacts(text);
      console.log('Contactos pre-procesados:', this.csvContacts);
      this.processContactsFromCSVFile(this.csvContacts);
    };
    // for (const element of this.csvContacts) {
    //   this.contacts.push(element['Teléfono']);
    // }
    reader.readAsText(file);
  }


  addValidPhonesFromCSVContacts(): void {
    if (!Array.isArray(this.csvContacts)) return;
    let added = 0;
    for (const contact of this.csvContacts ?? []) {
      if (contact && Array.isArray(contact.phones)) {
        for (const phone of contact.phones ?? []) {
          if (phone && phone.phoneValid && phone.number && !this.contacts.includes(phone.number)) {
            this.contacts.push(phone.number);
            added++;
          }
          if (phone && !phone.phoneValid) {
            this.invalidContacts++;
          }
        }
      }
    }
    console.log(`Se agregaron ${added} números válidos a la lista de contactos.`);
  }
}
