export declare class TimetableService {
    static createSchedule(data: {
        classId: string;
        teacherId: string;
        dayOfWeek: number;
        startTime: string;
        endTime: string;
        subject: string;
        room?: string;
    }): Promise<any>;
    static getTimetableByClass(classId: string): Promise<any>;
    static getTimetableByTeacher(teacherId: string): Promise<any>;
}
//# sourceMappingURL=timetable.service.d.ts.map