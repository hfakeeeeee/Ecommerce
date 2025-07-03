FROM eclipse-temurin:17-jdk-alpine

WORKDIR /app

COPY . .

RUN chmod +x ./gradlew
RUN ./gradlew build -x test

COPY stripe.crt /usr/local/share/ca-certificates/stripe.crt
RUN keytool -importcert -noprompt -trustcacerts -alias stripe -file /usr/local/share/ca-certificates/stripe.crt -keystore $JAVA_HOME/lib/security/cacerts -storepass changeit

# Create uploads directory
RUN mkdir -p /app/uploads && chmod 777 /app/uploads

EXPOSE 8080

CMD ["java", "-jar", "build/libs/ecommerce-0.0.1-SNAPSHOT.jar"] 