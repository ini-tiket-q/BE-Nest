import { 
    Entity, 
    PrimaryColumn, 
    Column, 
    CreateDateColumn, 
    UpdateDateColumn 
} from 'typeorm';

@Entity('transactions')
export class TransactionModel {
    @PrimaryColumn('uuid')
    id!: string;

    @Column('decimal', { precision: 10, scale: 2 })
    amount!: number;

    @Column({ length: 3 })
    currency!: string;

    @Column({ 
        type: 'enum', 
        enum: ['CREATED', 'PENDING', 'PAID', 'FAILED'] 
    })
    status!: string;

    @Column({ name: 'booking_id' })
    bookingId!: string;

    @Column({ name: 'customer_name' })
    customerName!: string;

    @Column({ name: 'customer_email' })
    customerEmail!: string;

    @Column({ name: 'customer_phone', nullable: true })
    customerPhone!: string | null;

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt!: Date;
}