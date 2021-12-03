# Generated by Django 3.2.2 on 2021-12-02 17:11

import datetime
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('pos', '0007_auto_20211127_1157'),
    ]

    operations = [
        migrations.CreateModel(
            name='ProductBySucursal',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('sucursal', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='pos.sucursal')),
            ],
        ),
        migrations.CreateModel(
            name='ProductBySucursalDetail',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date_joined', models.DateField(default=datetime.datetime.now)),
                ('product', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='pos.product')),
                ('productbysucursal', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='pos.productbysucursal')),
            ],
            options={
                'verbose_name': 'Lista de productos Stock',
                'verbose_name_plural': 'Lista de Productos Stock',
                'ordering': ['-id'],
                'default_permissions': (),
            },
        ),
    ]
